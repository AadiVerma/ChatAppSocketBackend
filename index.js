require('dotenv').config()
const io=require('socket.io')(process.env.PORT,{
    cors:true
})
let activeUsers=[]
io.on('connection',(socket)=>{
    
    // add new user
   socket.on('new-user-add',(newUserId)=>{
    try {
         
        if(!activeUsers.some((user)=>user.userId===newUserId)){
            activeUsers.push({userId:newUserId,socketId:socket.id}) 
         }
        //  console.log("user Connected",activeUsers);
         io.emit('get-users',activeUsers)
    } catch (error) {
        console.log("error",error) 
    }
   })
   // send message
   socket.on('send-message',(data)=>{
    // console.log("recieve",data);
        const {recieverId}=data;
        const user = activeUsers.find((user)=>user.userId===recieverId);
        // console.log("Sending from socket to : ",recieverId);
        // console.log("Data",data);
        if(user){
            // console.log("recieve data");
            // console.log(user);
            // console.log(user.socketId);
            socket.to(user.socketId).emit("recieve-message",data);
        }
      })
      // disconnect
   socket.on('disconnect',()=>{
    // console.log(socket.id);
    activeUsers=activeUsers.filter((user)=>user.socketId!==socket.id)
    // console.log("user Disconnected",activeUsers);
    io.emit('get-users',activeUsers)
   })


})
