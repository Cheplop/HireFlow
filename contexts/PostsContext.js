import { createContext, useState } from 'react';

export const PostsContext = createContext();

export function PostsProvider({ children }) {
    const [posts, setPosts] = useState(null);

    function fetchPosts() {
        if (posts !== null) {
            return Promise.resolve();
        }

        return fetch('https://dummyjson.com/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load posts.');
                }
                return response.json();
            })
            .then(json => {setPosts(json.products);});
    }

    function fetchPostById(id) {
        const post = posts?.find(item => String(item.id) === String(id));

        if (post) {
            return Promise.resolve({
                ...post,
                thumbnail: post.thumbnail || post.images?.[0],
            });
        }

        return fetch(`https://dummyjson.com/products/${id}?select=title,price,description,thumbnail`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load post details.');
                }

                return response.json();
            });
    }

    function createPost(postData) {
        if (posts?.some(post => String(post.id) === String(postData.id))) {
            return Promise.reject(new Error('That ID is already in use.'));
        }

        return fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not create post.');
                }

                return response.json();
            })
            .then(json => {
                const newPost = {
                    ...json,
                    ...postData,
                    id: postData.id,
                    isLocal: true,
                };

                setPosts(currentPosts => [newPost, ...(currentPosts || [])]);

                return newPost;
            });
    }

function updatePost(id, postData) {
    const post = posts?.find(item => item.id == id);

    if (post?.isLocal) {
        const updatedPost = { ...post, ...postData };

        setPosts(posts =>
            posts.map(item => item.id == id ? updatedPost : item)
        );

        return Promise.resolve(updatedPost);
    }

    return fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    })
        .then(response => response.json())
        .then(json => {
            setPosts(posts =>
                posts.map(item =>
                    item.id == id ? { ...item, ...json } : item
                )
            );

            return json;
        });
}


    function deletePost(id) {
        const post = posts?.find(item => item.id == id);

        if (post?.isLocal) {
            setPosts(posts => posts.filter(item => item.id != id));
            return Promise.resolve();
        }

        return fetch(`https://dummyjson.com/products/${id}`, {
            method: 'DELETE',
        }).then(response => {
            if (!response.ok) {
                throw new Error('Could not delete post.');
            }

            setPosts(posts => posts.filter(item => item.id != id));
        });
    }


    return (
        <PostsContext.Provider
            value={{
                posts,
                fetchPosts,
                fetchPostById,
                createPost,
                updatePost,
                deletePost,
            }}
        >
            {children}
        </PostsContext.Provider>
    );
}