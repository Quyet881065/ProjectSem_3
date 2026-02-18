
import { useState, useContext, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import { ShopContext } from '../../../context/ShopContext';
import { getMyPosts } from '../../../service/postService';
import { isAuthenticated } from '../../auth/service/authenticationService';
import { Post } from '../../../components/layout/Post';

const NewsLetterBox = () => {

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { navigate } = useContext(ShopContext);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();
  const lastPostElementRef = useRef();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      loadPosts(page);
    }
  }, [navigate, page]);

  const loadPosts = (page) => {
    console.log(`loading posts for page ${page}`);
    setLoading(true);
    getMyPosts(page)
      .then((response) => {
        setTotalPages(response.data.results.totalPages);
        setPosts((prevPosts) => [...prevPosts, ...response.data.results.data]);
        //setHasMore(response.data.result.data.length > 0);
        console.log("loaded posts:", response.data);
      })
  };
  console.log("posts state:", posts);

  useEffect(() => {
    if (!hasMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (page < totalPages) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    });
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    setHasMore(false);
  }, [hasMore]);

  return (
    <motion.div
      className='my-10'
      initial={{ opacity: 0, y: 100 }}  // Trạng thái ban đầu (ẩn)
      whileInView={{ opacity: 1, y: 10 }}  // Khi cuộn vào vùng nhìn thấy, hiện lên
      transition={{ duration: 1.5 }}  // Thời gian chuyển động
    >
      <div className='text-center mt-20 border py-10 rounded-lg'>
        <p className='text-xl '>Register now to receive promotional information and special offers from: FlowerShop</p>
        <form className='w-full sm:w-1/2 flex items-center mx-auto gap-10 py-3 mt-5'>
          <input className='w-full sm:w-1/2 outline-none border py-2' type='email' placeholder='Enter Email' />
          <button className='bg-blue-500 text-white px-8 py-2 text-sm'>OK</button>
        </form>
      </div>
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <Post ref={lastPostElementRef} key={post.id} post={post} />
          );
        } else {
          return <Post key={post.id} post={post} />;
        }
      })}
    </motion.div>
  )
}

export default NewsLetterBox