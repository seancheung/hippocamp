import Modal from './Modal';
import Message from './Message';

export default {
    install(Vue, options) {
        Vue.component('modal', Modal);
        Vue.component('message', Message);
    }
}