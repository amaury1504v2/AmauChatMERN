import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
    const { user } = ChatState(); // on importe le ChatState() du ChatProvider dans la const user en destructuring on importe une instance de user et pas setUser

  return (
    <div style={{ width: '100%' }}>
       {user && <SideDrawer />} {/* s'il y a l'utilisateur, rendre le composant SideDrawer */}
       <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="95.1vh"
        p="10px"
       >
        {user && <MyChats />}
        {user && <ChatBox />}
       </Box>
    </div>
  )
}

export default ChatPage