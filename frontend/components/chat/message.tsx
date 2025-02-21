import React from 'react'

const Message = ({message, currentUser}:any) => {
    const dateObject = new Date(message.created_at);
    const date = dateObject.toISOString().split('T')[0];
    const time = dateObject.toISOString().split('T')[1].split('.')[0];
    const shortName = message.sender.name.split(' ')[0][0] + message.sender.name.split(' ')[1][0]

    if(!message){
        return <div>Select any User from the option</div>
    }

    return(
        <div className={`flex items-center w-full gap-2 ${message.sender.id === currentUser.id ? 'justify-end ' : 'justify-start'}`}>
            {message.sender.id != currentUser.id &&
                <div className={`h-10 w-10 rounded-full flex justify-center items-center font-bold border`}>{shortName}</div>
            }

            <div className={`flex flex-row-reverse justify-between gap-4 px-2 py-2 rounded-2xl  border shadow-xl hover:shadow-2xl ${message.sender.id === currentUser.id ? 'bg-[#EA3D4F] text-white' : 'bg-white'}`}>
                <div className={`flex flex-col justify-center gap-1 mt-2`}>
                    <div className="flex gap-2">
                        <h1 className={`text-xs ${message.sender.id === currentUser.id ? '': ''}`}>{date}</h1>
                        <h1 className={`text-xs ${message.sender.id === currentUser.id ? '': ''}`}>{time}</h1>
                    </div>

                </div>

                <p className={`text-sm font-medium ${message.sender.id === currentUser.id ? '': ''}`}>{message.text}</p>
            </div>

            {message.sender.id === currentUser.id &&
                <div className={`h-10 w-10 rounded-full flex justify-center items-center font-bold border`}>{shortName}</div>
            }
        </div>
    )
}

export default Message