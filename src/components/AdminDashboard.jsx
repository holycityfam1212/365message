import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalVisits: 0,
        totalDraws: 0,
        totalShares: 0,
        topVerses: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                // 1. Total Visits
                const { count: visitsCount } = await supabase
                    .from('analytics_visits')
                    .select('*', { count: 'exact', head: true });

                // 2. Action Counts
                const { count: drawsCount } = await supabase
                    .from('analytics_actions')
                    .select('*', { count: 'exact', head: true })
                    .eq('action_type', 'DRAW');

                const { count: sharesCount } = await supabase
                    .from('analytics_actions')
                    .select('*', { count: 'exact', head: true })
                    .eq('action_type', 'SHARE');

                // 3. Top Verses (Need Custom Query or Client-side aggregation for simple prototype)
                // For simplicity, fetching all draws (optimizable later with RPC)
                const { data: draws } = await supabase
                    .from('analytics_actions')
                    .select('verse_id, theme')
                    .eq('action_type', 'DRAW');

                const verseCounts = {};
                draws.forEach(d => {
                    // Just counting themes or IDs
                    const key = d.theme; // Simplify to Theme popularity for now
                    verseCounts[key] = (verseCounts[key] || 0) + 1;
                });

                const topThemes = Object.entries(verseCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);

                setStats({
                    totalVisits: visitsCount || 0,
                    totalDraws: drawsCount || 0,
                    totalShares: sharesCount || 0,
                    topThemes
                });

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) return <div className="text-white p-8">Loading stats...</div>;

    return (
        <div className="fixed inset-0 z-50 bg-stone-900 text-white p-8 overflow-auto">
            <h1 className="text-3xl font-bold mb-8 text-yellow-500">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-stone-800 p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm uppercase">Total Visits</h3>
                    <p className="text-4xl font-bold">{stats.totalVisits.toLocaleString()}</p>
                </div>
                <div className="bg-stone-800 p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm uppercase">Total Draws</h3>
                    <p className="text-4xl font-bold text-blue-400">{stats.totalDraws.toLocaleString()}</p>
                </div>
                <div className="bg-stone-800 p-6 rounded-xl">
                    <h3 className="text-gray-400 text-sm uppercase">Total Shares</h3>
                    <p className="text-4xl font-bold text-pink-400">{stats.totalShares.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-stone-800 p-8 rounded-xl max-w-2xl">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">Most Popular Themes</h3>
                <ul>
                    {stats.topThemes.map(([theme, count], idx) => (
                        <li key={theme} className="flex justify-between items-center py-3 border-b border-gray-700/50 last:border-0">
                            <span className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">{idx + 1}</span>
                                <span className="capitalize">{theme}</span>
                            </span>
                            <span className="font-bold">{count} Draws</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
