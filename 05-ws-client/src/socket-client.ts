import { Manager, Socket } from "socket.io-client"


export const connectToServer = ( token: string ) => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token
        }
    });


    const socket = manager.socket('/');

    addListeners( socket );

}

const addListeners = ( socket: Socket ) => {

    const clientsUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messageUl = document.querySelector<HTMLInputElement>('#messages-ul')!;
    const serverStatusLabel = document.querySelector('#server-status')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected';
    });

    socket.on('clients-updated', ( clients: string[]) => {
        let clientsHtml = '';
        clients.forEach( clientId => {
            clientsHtml += `
                <li>${ clientId }</li>
            `;
        });

        clientsUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if( messageInput.value.trim().length <= 0 ) return;


        socket.emit('message-from-client', 
        { 
            id: 'YO!!', 
            message: messageInput.value
        });

        messageInput.value = '';
    });


    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
            <li>
                <strong>${ payload.fullName }</strong>
                <strong>${ payload.message }</strong>
            </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messageUl.append( li );

    });

}