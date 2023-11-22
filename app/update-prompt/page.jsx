'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Form from '@components/Form';

const EditPrompt = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/prompt/${promptId}`);
      const data = await res.json();
      setPost({ prompt: data.prompt, tag: data.tag });
    }
    if (promptId) fetchPost();
  }, [promptId])

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) return alert('Prompt ID not found!')

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        })
      });

      if (response.ok) {
        console.log('{SUCCESS}');
        router.push('/');
      }
    } catch (error) {
      console.error('{ERROR}',error);
    } finally {
      setSubmitting(false);
    }};

  return (
      <Form
          type="Edit"
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={updatePrompt}
      />
  )
}

export default EditPrompt