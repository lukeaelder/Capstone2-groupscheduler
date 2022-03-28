import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5020";

class SchedulerApi {
    static token;

    static async request(endpoint, data = {}, method = "get") {
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${SchedulerApi.token}` };
        const params = (method === "get") ? data : {};
        try {
          return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
          let message = err.response.data.error.message;
          alert(message);
          throw Array.isArray(message) ? message : [message];
        }
    }

    static async signup(data) {
        let res = await this.request(`auth/signup`, data, "post");
        return res.token;
    }

    static async login(data) {
        let res = await this.request(`auth/login`, data, "post");
        return res.token;
    }

    static async guestlogin() {
        let res = await this.request(`auth/guestlogin`, null, "post");
        return res.token;
    }

    static async getUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    static async createGroup(data) {
        let res = await this.request(`groups/new`, data, "post");
        return res.group;
    }

    static async getGroup(data) {
        let res = await this.request(`groups/get/${data.group_id}`, data, "post");
        return res.group;
    }

    static async getGroups(username) {
        let res = await this.request(`groups/${username}/all`);
        return res.groups;
    }

    static async leaveGroup(data) {
        let res = await this.request(`groups/leave/${data.group_id}`, data, "post");
        return res;
    }

    static async addMember(data) {
        let res = await this.request(`groups/add/${data.group_id}`, data, "post");
        return res;
    }

    static async addAnnouncement(data) {
        let res = await this.request(`groups/announcement/add`, data, "post");
        return res;
    }

    static async remAnnouncement(data) {
        let res = await this.request(`groups/announcement/remove`, data, "post");
        return res;
    }

    static async addTodo(data) {
        let res = await this.request(`groups/todo/add`, data, "post");
        return res;
    }

    static async changeTodo(data) {
        let res = await this.request(`groups/todo/update`, data, "post");
        return res;
    }
}

export default SchedulerApi;