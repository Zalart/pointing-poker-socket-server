import { useFormik } from "formik";
import { useState, useEffect } from "react";
import Switch from 'react-input-switch';
import Button from "../button/Button";
import Input from "../input/Input";
import { socket } from "../../common/utils/socket/socket";
import { 
    JOIN_GAME, 
    CREATE_GAME,
    RECEIVE_MESSAGE, 
    SEND_MESSAGE, 
    USER_CONNECTED, 
    USER_DISCONNECTED, 
    ROOM_ID } from '../../common/utils/socket/constants';

const ConnectionForm = () => {

    const [value, setValue] = useState('Connect as observer');
    const [usersData, setUsersData] = useState([]);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            position: "",
            room: "",
            ava: "",
            // isObserver: "no"
        },
        onSubmit: values => {
           
            createSocketRoom(values);
        }

    })

    const handleUserConnect = (userId) => {
        //handleIncomingMessage({ message: `${userId} connected` })
      }
    
      const handleUserDisconnect = (userId) => {
       // handleIncomingMessage({ message: `${userId} disconnected` })
      }

    const createSocketRoom = (userData) => {

        if (userData) { socket.emit(CREATE_GAME, {
          room: ROOM_ID,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isObserver: false // hardcoded it just for the testing purposes
        })
      }

    }

    const joinSocketRoom = (userData) => {

        if (userData) { socket.emit(JOIN_GAME, {
          room: userData.room,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isObserver: false // hardcoded it just for the testing purposes
        })
      }

    }

    const addSocketListeners = () => {
        //socket.on(RECEIVE_MESSAGE, handleIncomingMessage)
        socket.on('SHOW_USERS', (data) => {
            console.log(data)
            setUsersData(data);
        })
        socket.on(USER_CONNECTED, handleUserConnect)
        socket.on(USER_DISCONNECTED, handleUserDisconnect)
      }

      const removeSocketListeners = () => {
        //socket.off(RECEIVE_MESSAGE, handleIncomingMessage)
        socket.off(USER_CONNECTED, handleUserConnect)
        socket.off(USER_DISCONNECTED, handleUserDisconnect)
      }

      const leaveRoomHandler = () => {
        if (socket.id) {
            socket.emit('LEAVE_ROOM', socket.id);
            setUsersData({});
          }
      };

      useEffect(() => {
        createSocketRoom();
        addSocketListeners();
        return () => removeSocketListeners();
      }, [])

     
    return (
        <div>
            <h2>
            {usersData.length > 0 ? `Connected to lobby room: ${usersData[0].room}` : `Connect to Lobby`}
            </h2>
            {usersData.length > 0 && usersData.map( user => <div key={user.userId}>USER ID: {user.userId} - Firstname: {user.firstName}</div> )}
                {value}
                
            

            <form onSubmit={formik.handleSubmit}>
            <Switch on="Connect as player" off="Connect as observer" value={value} onChange={setValue} />
                <Input
                    text="Your first name:"
                    id="firstName"
                    name="firstName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    required />

                <Input
                    text="Your last name (optional):"
                    id="lastName"
                    name="lastName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                />

                <Input
                    text="Your job position (optional):"
                    id="position"
                    name="position"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.position}
                />

                <Input
                    text="Room name (temporary field for users to join room):"
                    id="room"
                    name="room"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.room}
                />

                <label htmlFor="ava">Image:</label>
                <div>
                    <input
                        id="ava"
                        name="ava"
                        type="file"

                    />
                </div>
                <Button text="Enter" height="big" type="submit" />
                <Button type="button" color="white" text="Cancel" height="big" />
                
            </form>
            <Button action={leaveRoomHandler} type="button" color="white" text="Leave" height="big" />
            
        </div>
    )
}

export default ConnectionForm;
