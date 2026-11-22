import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const PostsContext = createContext();
const POSTS_STORAGE_KEY = "hireflow.posts";

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(POSTS_STORAGE_KEY).then((stored) => {
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setPosts(parsed);
      } catch {
        // Ignore malformed local data and keep an empty collection.
      }
    }).catch(() => {});
  }, []);

  const persist = (nextPosts) => {
    setPosts(nextPosts);
    return AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(nextPosts));
  };

  const fetchPosts = () => Promise.resolve(posts);
  const fetchPostById = (id) => Promise.resolve(
    posts.find((post) => String(post.id) === String(id)) || null,
  );

  function createPost(postData) {
    const id = postData.id ?? `post-${Date.now()}`;
    if (posts.some((post) => String(post.id) === String(id))) {
      return Promise.reject(new Error("That ID is already in use."));
    }
    const newPost = { ...postData, id, isLocal: true };
    return persist([newPost, ...posts]).then(() => newPost);
  }

  function updatePost(id, postData) {
    const updated = posts.map((post) =>
      String(post.id) === String(id) ? { ...post, ...postData } : post,
    );
    return persist(updated).then(() => updated.find((post) => String(post.id) === String(id)));
  }

  const deletePost = (id) => persist(posts.filter((post) => String(post.id) !== String(id)));

  return (
    <PostsContext.Provider value={{ posts, fetchPosts, fetchPostById, createPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}
