'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Profile from '@components/Profile';


const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${session?.user?.id}/posts`)
      const data = await res.json();
      console.log(data)
      setPosts(data);
    }
    if (session?.user.id) fetchPosts()
  }, [session?.user?.id])


  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm('Are you sure you want to delete this prompt?');
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPosts = posts.filter((p) => p._id !== post._id);
        setPosts(filteredPosts);

        if (response.ok) {
          console.log('{SUCCESS}');
          router.push('/');
        }
      } catch (error) {
        console.error('{ERROR}',error);
      }
    }
  }

  return (
    <Profile
      name="My"
      desc='Welcome to my personalized profile page.'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile