import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFavorites = () => {
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await api.get('/api/favorites');

            // Create a Set of favorite item IDs for quick lookup
            const favoriteIds = new Set();
            data.workspaces?.forEach(ws => favoriteIds.add(ws._id));
            data.projects?.forEach(proj => favoriteIds.add(proj._id));
            data.documents?.forEach(doc => favoriteIds.add(doc._id));
            data.files?.forEach(file => favoriteIds.add(file._id));

            setFavorites(favoriteIds);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = useCallback(async (itemType, itemId) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.post(
                '/api/favorites/toggle',
                { itemType, itemId },
                config
            );

            // Update local state
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                if (data.isFavorite) {
                    newFavorites.add(itemId);
                } else {
                    newFavorites.delete(itemId);
                }
                return newFavorites;
            });

            return data.isFavorite;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    }, []);

    const isFavorite = useCallback((itemId) => {
        return favorites.has(itemId);
    }, [favorites]);

    return {
        favorites,
        loading,
        toggleFavorite,
        isFavorite,
        refetch: fetchFavorites
    };
};

export default useFavorites;
