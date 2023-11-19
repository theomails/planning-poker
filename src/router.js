import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/login",
    name: "login",
    component: () => import("./components/Login")
  },{
    path: "/",
    alias: "/create-poker-room",
    name: "create-poker-room",
    component: () => import("./components/CreatePokerRoom")
  },
  {
    path: "/poker-room/:roomId",
    name: "poker-room",
    component: () => import("./components/PokerRoomDisplay"), 
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;