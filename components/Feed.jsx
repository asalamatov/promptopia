'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PromptCard from "./PromptCard"
import { useSession } from "next-auth/react"

const PromptCardList = ({ data, handleTagClick, handleEdit, handleDelete, handleUsernameClick }) => {
  return (
    <div className="prompt_layout mt-16">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleEdit={() => handleEdit && handleEdit(post)}
          handleDelete={() => handleDelete && handleDelete(post)}
          handleUsernameClick={() => handleUsernameClick && handleUsernameClick(post)}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState("")
  const [searchTimout, setSearchTimeout] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [posts, setPosts] = useState([])
  const router = useRouter()
  const { data: session } = useSession()

  const filterPrompts = (searchText) => {
    const regex = RegExp(searchText, "i")
    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    )
    return results
  }

  const handleSearchChange = (e) => {
    clearTimeout(searchTimout)
    setSearchText(e.target.value)

    setSearchTimeout(setTimeout(() => {
      const searchResult = filterPrompts(e.target.value)
      setSearchResults(searchResult)
      }, 500))
    }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/prompt")
        const data = await res.json()
        console.log(data)
        if (data) {
          setPosts(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
  }, [])

  const handleTagClick = (tag) => {
    setSearchText(tag)
    const searchResult = filterPrompts(tag)
    setSearchResults(searchResult)
  }

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

  const handleUsernameClick = (post) => {

    if (post.creator._id === session?.user?.id) return router.push('/profile');

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`)
  }


  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username "
          className="search_input"
          value={searchText}
          onChange = {handleSearchChange}
        />
      </form>
      {searchText ? (
        <PromptCardList
        data={searchResults}
        handleTagClick={handleTagClick}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleUsernameClick={handleUsernameClick}
        />

      ): (
      <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleUsernameClick={handleUsernameClick}
      />
      ) }
    </section>
  )
}

export default Feed