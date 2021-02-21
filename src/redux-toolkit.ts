import {createSlice,configureStore,PayloadAction, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import { Todo } from './type';
import { v1 as uuid } from "uuid";

const todosInitialState: Todo[] = [
    {
      id: uuid(),
      desc: "Learn React",
      isComplete: true
    },
    {
      id: uuid(),
      desc: "Learn Redux",
      isComplete: true
    },
    {
      id: uuid(),
      desc: "Learn Redux-ToolKit",
      isComplete: false
    }
  ];
const todoSlice=createSlice({
    name:'todo',
    initialState:todosInitialState,
    reducers:{
        create:{
            reducer:(state,{payload}:PayloadAction<{desc:string,id:string,isComplete:boolean}>)=>{
             state.push(payload)
            },
            prepare:({desc}:{desc:string})=>{
              return  {
                 payload:{
                    id:uuid(),
                    desc,
                    isComplete:false,
                 }
              }
            }
        },
       edit:(state,action:PayloadAction<{id:string,desc:string}>)=>{
           const {payload}=action
       const stateEdit=  state.find((todo)=>todo.id===payload.id)
       if(stateEdit) stateEdit.desc=payload.desc;
       },
       remove:(state,action:PayloadAction<{id:string}>)=>{
           const {payload}=action;
        const index=  state.findIndex(todo=>todo.id ===payload.id);
        state.splice(index,1);
       },
       toggle:(state,action:PayloadAction<{id:string,isComplete: boolean}>)=>{
        const {payload}=action
        const stateEdit=  state.find((todo)=>todo.id===payload.id)
        if(stateEdit) stateEdit.isComplete=payload.isComplete; 
       }
    }
})
const selectedTodoSlice=createSlice({
    name:'selectedTodo',
    initialState:null as string |null,
    reducers:{
    select:(state,{payload}:PayloadAction<{id:string}>)=>payload.id
    }
})

const counterSlice=createSlice({
    name:'counter',
    initialState:0,
    reducers:{

    },
    extraReducers:{
        [todoSlice.actions.create.type]:(state)=>state+1,
        [todoSlice.actions.edit.type]:(state)=>state+1,
        [todoSlice.actions.remove.type]:(state)=>state+1,
        [todoSlice.actions.toggle.type]:(state)=>state+1,
    }
})

export const {
    create: createTodoActionCreator,
    edit: editTodoActionCreator,
    toggle: toggleTodoActionCreator,
    remove: deleteTodoActionCreator
  } = todoSlice.actions;
  
  export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;
  
  const reducer = combineReducers({
    todos: todoSlice.reducer,
    selectedTodo: selectedTodoSlice.reducer,
    counter: counterSlice.reducer
  });
  
  const middleware = [...getDefaultMiddleware()];
  export default configureStore({
    reducer,
    middleware
  });
