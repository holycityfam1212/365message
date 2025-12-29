import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { verses } from '../data/verses';

const DataUploader = () => {
    const [status, setStatus] = useState('Ready to upload');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        setIsLoading(true);
        setStatus('Uploading...');

        try {
            // 1. Check if verses already exist to avoid duplicates
            const { count, error: countError } = await supabase
                .from('verses')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;

            if (count > 0) {
                setStatus(`Database already has ${count} verses. Skipping upload.`);
                setIsLoading(false);
                return;
            }

            // 2. Upload in batches
            const { error } = await supabase
                .from('verses')
                .insert(verses);

            if (error) throw error;

            setStatus('Success! 130 verses uploaded.');
        } catch (err) {
            console.error(err);
            setStatus(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-50 bg-white p-3 sm:p-4 rounded shadow-lg max-w-[calc(100vw-1rem)] sm:max-w-sm">
            <h3 className="font-bold mb-2 text-sm sm:text-base">Admin: Data Setup</h3>
            <p className="mb-4 text-sm">{status}</p>
            <button
                onClick={handleUpload}
                disabled={isLoading}
                className="bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded disabled:opacity-50 text-sm sm:text-base"
            >
                {isLoading ? 'Uploading...' : 'Upload Verses to DB'}
            </button>
        </div>
    );
};

export default DataUploader;
