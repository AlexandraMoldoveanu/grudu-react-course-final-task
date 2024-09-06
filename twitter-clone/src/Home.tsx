import { useEffect, useRef, useState } from "react";

type Tweet = {
  id: string;
  name: string;
  text: string;
  initials?: string;
};

export default function Home() {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    const fetchTweetsAndUsers = async () => {
      try {
        const tweetsData = await (
          await fetch("http://localhost:3001/tweets")
        ).json();
        const usersData = await (
          await fetch("http://localhost:3001/users")
        ).json();

        const getInitials = (name: string) => {
          if (!name) {
            return "JD";
          }

          const initials = name
            .split(" ")
            .reduce((result, currentWord) => result + currentWord[0], "");

          return initials;
        };

        const tweetModelArr: Tweet[] = tweetsData.map(
          (tweet: { id: string; author_id: string; text: string }) => {
            let user = usersData.find(
              (user: { id: string; name: string; email: string }) =>
                user.id === tweet.author_id
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
  }, []);

  const refInput = useRef<HTMLInputElement>(null);

  function handleTweet(e: any) {
    e.preventDefault();
    if (refInput.current) {
      console.log(refInput.current.value);
      const newTweet: Tweet = {
        id: Math.random().toString(),
        name: "Ale",
        text: refInput.current.value,
        initials: "AM",
      };
      setTweets((prevSt) => [...prevSt, newTweet]);
    }
  }

  return (
    <>
      <header>
        <div>Another Twitter Clone</div>
        <div className="user-info">
          <span className="username">John Smith</span>
          <span className="user-avatar">JS</span>
        </div>
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
