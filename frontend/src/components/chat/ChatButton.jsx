import { Message } from "@mui/icons-material"
const ChatButton = ({onClick}) => {
    return (
        <div onClick={onClick}
            className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full p-4 shadow-lg cursor-pointer hover:scale-105 transition z-50">
            <Message />
        </div>
    )
}
export default ChatButton