import { useState } from "react";
import { v4 } from "uuid";
import Markdown from "react-markdown";
import BotIcon from "./boticon";
import SendIcon from "./sendicon";
import Lottie from "lottie-react";
import FetchingAnimation from "./fetching.json";
const MsgBubble = (props) => {
  let bg = props.belongsTo === "user" ? "bg-sky-500" : "bg-green-400";
  let float = props.belongsTo === "user" ? "justify-end" : "justify-start";
  const customRenderers = {
    list: ({ ordered, children }) => {
      console.log(ordered, children);
      return <ol className="list-disc">{children}</ol>;
    },
  };
  return (
    <>
      <div className={`${float} flex w-full`}>
        <div
          className={`${bg} m-2 p-2 text-sm md:text-md lg:text-lg rounded-lg w-fit max-w-[45vw] h-fit text-white`}
        >
          <Markdown components={customRenderers}>{props.msg}</Markdown>
        </div>
      </div>
    </>
  );
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const getResponse = async () => {
    if (prompt.length < 2) return;
    setPrompt("");
    setChatHistory((chatHistory) => [
      { msg: prompt, belongsTo: "user" },
      ...chatHistory,
    ]);
    setIsFetching(true);
    const res = await fetch(
      `https://gemini-task-backend.vercel.app/?prompt=${encodeURI(prompt)}`,
      {
        method: "GET",
        headers: {
          "access-control-allow-origin": "*",
          "Content-type": "application/json; charset=UTF-8",
        },
      },
    );
    const data = await res.json();
    setChatHistory((chatHistory) => [
      { belongsTo: "bot", msg: data.response },
      ...chatHistory,
    ]);
    setIsFetching(false);
  };
  const chattingStyle =
    "h-[83vh] md:lg:h-[87-vh] p-4 w-full self-start flex flex-col-reverse justify-items-start overflow-y-scroll";
  const initalStyle =
    "h-[83vh] md:lg:h-[87-vh] w-full p-4 flex self-start flex-col justify-center items-center";
  return (
    <div className="w-screen flex flex-col items-end my-4 px-4">
      <div
        id="Responses"
        className={chatHistory.length > 0 ? chattingStyle : initalStyle}
      >
        {isFetching ? (
          <Lottie
            className="h-24"
            animationData={FetchingAnimation}
            loop={true}
          />
        ) : (
          <></>
        )}
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <MsgBubble belongsTo={chat.belongsTo} msg={chat.msg} key={v4()} />
          ))
        ) : (
          <>
            <BotIcon className="h-48 md:h-64 lg:h-72" />
            <h2 className="text-white text-center text-lg p-2 lg:text-3xl md:text-2xl">
              Ask Your Medical queries to the bot
            </h2>
          </>
        )}
      </div>

      <div className="flex px-4 my-4 justify-center w-screen justify-items-center fixed bottom-1 md:bottom-2 lg:bottom-4 left-[50%] translate-x-[-50%] bg-[#343541]">
        <form action={getResponse}>
          <div className="flex flex-row items-center h-[7vh] border-2 border-[#43434e] rounded-xl">
            <input
              className="clear p-4 w-[80vw] h-16  placeholder-gray-400 text-white focus:outline-none border-none bg-inherit"
              type="text"
              value={prompt}
              placeholder="say something to the bot..."
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              autoComplete="off"
            />
            <button
              className="bg-none h-[80%] rounded-xl p-2 m-2 bg-green-300"
              type="submit"
              value="submit"
              onClick={(e) => {
                e.preventDefault();
                getResponse();
              }}
            >
              <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
