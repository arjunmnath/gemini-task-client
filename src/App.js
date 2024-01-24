import { useState } from "react";
import "./App.css";
import { v4 } from "uuid";
const MsgBubble = (props) => {
  let bg = props.belongsTo === "user" ? "bg-sky-500" : "bg-green-400";
  let float = props.belongsTo === "user" ? "justify-end" : "justify-start";
  return (
    <>
      <div className={`${float} flex w-full`}>
        <div
          className={`${bg} m-2 p-2 rounded-lg w-fit max-w-[45vw] h-fit text-white`}
        >
          {props.msg}{" "}
        </div>
      </div>
    </>
  );
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const getResponse = async () => {
    if (prompt.length < 2) return;
    setPrompt("");
    setChatHistory((chatHistory) => [
      { msg: prompt, belongsTo: "user" },
      ...chatHistory,
    ]);
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
  };
  return (
    <div className="w-screen flex flex-col items-end m-4">
      <div
        id="Responses"
        className="h-[87vh] w-full p-4 flex flex-col-reverse justify-items-start overflow-y-scroll"
      >
        {chatHistory.map((chat) => (
          <MsgBubble belongsTo={chat.belongsTo} msg={chat.msg} key={v4()} />
        ))}
      </div>

      <div className="flex justify-center w-screen p-4 fixed bottom-4 bg-[#343541]">
        <form action={getResponse}>
          <div className="flex flex-row items-center h-[7vh] border-2 border-[#43434e] rounded-xl">
            <input
              className="clear p-4 w-[80vw] h-16  placeholder-gray-400 text-white focus:outline-none border-none bg-inherit"
              type="text"
              name="somewothing"
              value={prompt}
              placeholder="say something to the bot...
            "
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              autoComplete="off"
            />
            <button
              className="bg-none h-[80%] rounded-xl p-2 bg-green-200"
              type="submit"
              value="submit"
              onClick={(e) => {
                e.preventDefault();
                getResponse();
              }}
            >
              <svg
                className="h-full"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#fff"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 495.003 495.003"
                xmlSpace="preserve"
              >
                <g id="XMLID_51_">
                  <path
                    id="XMLID_53_"
                    d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616   l-67.6-32.22V456.687z"
                  />
                  <path
                    id="XMLID_52_"
                    d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422   c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414   l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956   L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"
                  />
                </g>
              </svg>{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
