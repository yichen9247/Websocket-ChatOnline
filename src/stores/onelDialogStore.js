
import { ref } from "vue"
import { defineStore } from "pinia"

export const useOnelDialogStore = defineStore('onelDialogStore',() => {
    const personalCenter = ref(false);
    const searchalCenter = ref(false);
    const settinglCenter = ref(false);
    
    const setPersonalCenter = (value) => personalCenter.value = value;
    const setSearchalCenter = (value) => searchalCenter.value = value;
    const setSettinglCenter = (value) => settinglCenter.value = value;

    return ({ personalCenter, searchalCenter, settinglCenter, setPersonalCenter, setSearchalCenter, setSettinglCenter });
});