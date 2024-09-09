import { useEffect, useRef, useState } from "react";
import { User } from "./Signup";
import { getInitials } from "./Signup";
import { useAuth } from "./store/auth-context";
import { useNavigate } from "react-router-dom";

type Tweet = {
  id: string;
  name: string;
  text: string;
  initials?: string;
};

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const { loggedInUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/login");
    }

    const fetchTweetsAndUsers = async () => {
      try {
        const tweetsData = await (
          await fetch("http://localhost:3001/tweets")
        ).json();
        const usersData = await (
          await fetch("http://localhost:3001/users")
        ).json();

        const tweetModelArr: Tweet[] = tweetsData.map(
          (tweet: { id: string; author_id: string; text: string }) => {
            let user = usersData.find(
              (user: User) => user.id === tweet.author_id
            );
            return {
              id: tweet.id,
              text: tweet.text,
              name: user?.name ?? "",
              initials: getInitials(user?.name),
            };
          }
        );
        setTweets(tweetModelArr);
      } catch (err) {
        console.error("Error fetching data: ", err);
      }
    };
    fetchTweetsAndUsers();
  }, [loggedInUser]);

  const refInput = useRef<HTMLInputElement>(null);

  async function handleTweet(e: any) {
    e.preventDefault();
    if (refInput.current && loggedInUser) {
      console.log(refInput.current.value);
      const newTweet: { id: string; author_id: string; text: string } = {
        id: Math.random().toString(),
        author_id: loggedInUser.id,
        text: refInput.current.value,
      };
      //   setTweets((prevSt) => [
      //     ...prevSt,
      //     {
      //       id: newTweet.id,
      //       text: newTweet.text,
      //       name: loggedInUser.name,
      //       initials: loggedInUser.initials,
      //     },
      //   ]);

      try {
        const response = await fetch("http://localhost:3001/tweets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTweet),
        });
        if (response.status === 201) {
          const createdTweet = await response.json();
          setTweets((prevTweets) => [
            ...prevTweets,
            {
              id: createdTweet.id,
              text: createdTweet.text,
              name: loggedInUser.name,
              initials: loggedInUser.initials,
            },
          ]);
          console.log("Tweet added: ", createdTweet);
          refInput.current.value = "";
        }
      } catch (err) {
        console.error("Error adding tweet: ", err);
      }
    }
  }
  function onLogout() {
    logout();
    navigate("/login");
  }
  return (
    <>
      <header>
        <div>Another Twitter Clone</div>
        {loggedInUser && (
          <>
            <div className="user-info">
              <span className="username">{loggedInUser.name}</span>
              <span className="user-avatar">{loggedInUser.initials}</span>
              <span onClick={onLogout}>Log out</span>
            </div>
          </>
        )}
      </header>
      <div className="container">
        <section className="new-tweet">
          <form action="">
            <input ref={refInput} type="text" placeholder="What's happening?" />
            <button type="submit" className="button" onClick={handleTweet}>
              Tweet
            </button>
          </form>
        </section>

        <section className="tweet-list">
          {tweets.map((tweet) => (
            <div key={tweet.id} className="tweet">
              <div className="tweet-avatar">{tweet.initials}</div>

              <div>
                <div className="tweet-username">{tweet.name}</div>
                <p
                  className="tweet-text"
                  dangerouslySetInnerHTML={{ __html: tweet.text }}
                ></p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
