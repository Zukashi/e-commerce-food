import React, {useState} from 'react';

export const  OneSubImage = () => {
    const [isPicked, setIsPicked] = useState(false)
    return (<>

           <div className='main-img-container sub-img-container'>
               {isPicked ? <img width={'100%'} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8UaO8zvh5DjMIZ3C-jUQyIdtnCH9VUBvPRCZIbf60YQ&s" alt=""/> : <div className='main-img-placeholder sub-image'>
                   <div className='text-inside-placeholder-container'>
                       <div className='dimensions-container sub-image'>
                           <p>765 X 850</p>
                       </div>
                   </div>
               </div>}

                   <div className='icon-edit-container sub-image' style={{width:'25px', height:'25px'}}>
                       <img src="https://cdn-icons-png.flaticon.com/512/2356/2356780.png" width={'15px'} alt="edit icon"/>
                   </div>


       </div></>)
}