import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../auth/useAuth';
import GatedButton from '../components/GatedButton';
import { can } from '../utils/permissions';

export default function Posts(){
  const { user, access } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(()=> {
    async function load() {
      try {
        const res = await api.get('/posts', { headers: { Authorization: `Bearer ${access}` } });
        setPosts(res.data);
      } catch (err) { console.error(err); }
    }
    if (access) load();
  }, [access]);

  async function create() {
    const title = prompt('Title');
    const body = prompt('Body');
    if (!title) return;
    await api.post('/posts', { title, body }, { headers: { Authorization: `Bearer ${access}` } });
    const res = await api.get('/posts', { headers: { Authorization: `Bearer ${access}` } });
    setPosts(res.data);
  }

  async function remove(id) {
    await api.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${access}` } });
    setPosts(posts.filter(p => p._id !== id));
  }

  async function edit(p) {
    const title = prompt('New title', p.title);
    if (!title) return;
    await api.put(`/posts/${p._id}`, { title }, { headers: { Authorization: `Bearer ${access}` } });
    setPosts(posts.map(x => x._id === p._id ? { ...x, title } : x));
  }

  return (
    <div>
      <h2>Posts</h2>
      <div>
        <GatedButton user={user} action="posts:create" onClick={create}>Create Post</GatedButton>
      </div>
      <ul>
        {posts.map(p => (
          <li key={p._id}>
            <strong>{p.title}</strong> by {p.authorId}
            {' '}
            <GatedButton user={user} action="posts:update" resource={{ authorId: p.authorId, ...p }} onClick={()=>edit(p)}>Edit</GatedButton>
            <GatedButton user={user} action="posts:delete" resource={{ authorId: p.authorId, ...p }} onClick={()=>remove(p._id)}>Delete</GatedButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
