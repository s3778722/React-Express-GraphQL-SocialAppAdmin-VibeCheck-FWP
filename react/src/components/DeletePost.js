import React from "react";
import {
  getComments,
  getPosts,
  updatePost,
  updateComment,
} from "../data/repository";
import { useState, useEffect } from "react";

const DeletePost = ({ users, setUsers }) => {
  //useState hooks
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  //useEffects hooks to load the latest posts from database
  useEffect(() => {
    const loadPosts = async () => {
      const currentPosts = await getPosts();
      setPosts(currentPosts);
    };
    loadPosts();
  }, [comments]);

  //useEffects hooks to load the latest comments from database

  //event handler for deleting a post
  const handleDeletePost = async (event) => {
    event.preventDefault();
    //log the user out
    await updatePost(
      parseInt(event.target.value),
      "[**** This post has been deleted by the admin***]"
    );

    const tmpPosts = [...posts];
    tmpPosts.map((p) => {
      if (p.post_id === parseInt(event.target.value)) {
        p.text = "[**** This post has been deleted by the admin***]";
      }
      return tmpPosts;
    });
    setPosts(tmpPosts);
  };

  //event handler for deleting a comment
  const handleDeleteComment = async (event) => {
    event.preventDefault();
    //log the user out
    const resComment = await updateComment(
      parseInt(event.target.value),
      "[**** This comment has been deleted by the admin***]"
    );

    const comments = resComment;

    setComments(comments);
  };

  return (
    <div className="bg">
      <h1 className="text-light p-5 fst-italic">ALL POSTS</h1>

      <ol className="list-group list-group-numbered px-5">
        {posts &&
          posts.map((p) => {
            return (
              <>
                <li
                  className="list-group-item bg-transparent text-white"
                  key={p.post_id}
                >
                  <hr />
                  <p>Post</p>
                  <span className="badge bg-info rounded-pill">
                    {p.userEmail}
                  </span>
                  <h5>{p.text}</h5>
                  <span className="badge bg-secondary rounded-pill">
                    {p.date}
                  </span>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-danger ps-4 pe-4"
                      value={p.post_id}
                      onClick={handleDeletePost}
                    >
                      Delete
                    </button>
                  </div>
                  <br />
                  <br />
                  <hr />
                </li>
                {p.comments &&
                  p.comments.map((c) => {
                    return (
                      <li
                        className="list-group-item bg-transparent text-white"
                        key={c.comment_id}
                      >
                        <p>Comment</p>
                        <span className="badge bg-primary rounded-pill">
                          {c.userEmail}
                        </span>
                        <h5>{c.text}</h5>
                        <span className="badge bg-secondary rounded-pill">
                          {c.date}
                        </span>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="btn btn-danger ps-4 pe-4"
                            value={c.comment_id}
                            onClick={handleDeleteComment}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
              </>
            );
          })}
      </ol>
    </div>
  );
};

export default DeletePost;
