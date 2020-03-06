import React, { useState, useRef, useEffect } from 'react';

const TodoList = () => {
    // destructure state and setter method off of useState hook
    const [ state, setState ] = useState({
        // array with "todo item" objects that have content as key and completion bool as value
        todo_items: [],
        // str to help hide the submit button until input is made
        todo:"",
    });
    useEffect(()=>{
        setState({
            todo_items: JSON.parse(localStorage.getItem('list_store')),
            todo:""
        });
    }, []);

    useEffect(()=>{
        localStorage.setItem('list_store', JSON.stringify(state.todo_items));
    }, [state.todo_items]);



    // whenever change detected, update state
    const onChangeHandler = event => {
        // copy of state by using spread, .name and .value correspond to input
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    }
    
    // Whenever new todo submitted
    const onSubmitHandler = event => {
        event.preventDefault();        

        // list1.concat(list2) merges lists. here, merges two lists of todo objects
        setState({
            ...state,
            todo_items: state.todo_items.concat([{content: event.target.todo.value, completed: false}]),
        });
        // resets input
        todoInput.current.value = "";
        
    }
    

    // Whenever todo is deleted
    const deleteTodoHandler = event => {
        setState({
            ...state,
            todo_items: state.todo_items.filter((obj)=>{return obj.content !== state.todo_items[event.target.name].content})
        });
    }
    
    // Whenever todo is marked as complete
    const completeTodoHandler = event => {
        // overwrite state
        setState({
            ...state,
            todo_items: state.todo_items.map((obj)=>{
                if (obj.content === state.todo_items[event.target.name].content){
                    obj.completed = !obj.completed;
                }
                return obj;
            })
        });
    }
    
    // For resetting input
    const todoInput = useRef(null);

    const completedStyle = {
        textDecoration: "line-through"
    };

    return(
        <div>
            <form onSubmit={onSubmitHandler}>
                <div>
                    <input type="text" name="todo" placeholder="Write something to do..." onChange={onChangeHandler} ref={todoInput}/>
                    {/* show add button when input isn't blank AND it's not already in the list */}
                    {state.todo.length > 0 && state.todo_items.filter((obj)=>{return obj.content === state.todo}).length ===0 && <input type="submit"></input>}
                </div>
            </form>
            <div>
                <ul>
                    {state.todo_items.map((todo_item, idx)=>{
                        // if item's complete is false ? render with no style : render with style
                        return todo_item.completed === false ? <li key={idx}>
                            {todo_item.content}
                            <input type="checkbox" name={idx} onChange={completeTodoHandler}/>
                            <button name={idx} onClick={deleteTodoHandler}>Delete</button>
                        </li> : <li key={idx} style={completedStyle}>
                        {todo_item.content}
                        <input type="checkbox" name={idx} onChange={completeTodoHandler}/>
                        <button name={idx} onClick={deleteTodoHandler}>Delete</button>
                    </li>
                    })}
                </ul>
            </div>
        </div>
    );
}

export default TodoList;