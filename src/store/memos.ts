import { MemoService } from "@/api/services/memos";
import { MemoModel, UpdateMemoModel } from "@/models/memo";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";
import { useNotifications } from "@/composables/useNotifications";

export const useMemoStore = defineStore("memos", () => {
  // Data
  const memos = ref<MemoModel[]>([]);
  const editDialog = ref(false);
  const activeMemo = ref<MemoModel | null>(null);
  const searchText = ref<string | null>(null);

  // Services
  const memoService = new MemoService();

  // Stores
  const userStore = useUserStore();

  // Composables
  const { alert } = useNotifications();

  const setMemos = (data: MemoModel[]) => {
    memos.value = data;
  };

  const loadMemos = async () => {
    if (!userStore.user) {
      return;
    }
    const data = await memoService.getMemos(userStore.user.id);
    setMemos(data);
  };

  const saveMemo = async (content: string) => {
    const userId = userStore.user?.id as string;
    const id = await memoService.saveMemo({
      content,
      userId
    });
    setMemos([
      {
        content,
        id,
        createdAt: new Date().toString(),
        userId,
        pinned: false
      },
      ...memos.value
    ]);
    alert({
      text: "Memo saved!"
    });
  };

  const deleteMemo = async (id: number) => {
    await memoService.deleteMemo(id);
    memos.value = memos.value.filter((m) => m.id !== id);
  };

  const pinMemo = async (id: number) => {
    const memo = memos.value.find((m) => m.id === id);
    if (memo) {
      try {
        await memoService.pinMemo(id, memo.pinned);
        memo.pinned = !memo.pinned;
        alert({
          text: `Memo ${memo.pinned ? "pinned" : "unpinned"}!`
        });
      } catch (e) {
        alert({
          text: JSON.stringify(e)
        });
      }
    }
  };

  const editMemo = async (content: string) => {
    const userId = userStore.user?.id as string;
    const id = activeMemo.value!.id;
    await memoService.editMemo({
      content,
      id,
      userId
    });
    const memo = memos.value.find((m) => m.id === id);
    if (memo) {
      memo.content = content;
      alert({
        text: "Memo saved!"
      });
      setActiveMemo(null);
      closeEditDialog();
    }
  };

  const openEditDialog = () => {
    editDialog.value = true;
  };

  const closeEditDialog = () => {
    editDialog.value = false;
  };

  const setActiveMemo = (data: MemoModel | null) => {
    activeMemo.value = data;
  };

  const setSearchText = (data: string | null) => {
    searchText.value = data;
  };

  return {
    memos,
    setMemos,
    loadMemos,
    saveMemo,
    deleteMemo,
    pinMemo,
    editMemo,
    editDialog,
    closeEditDialog,
    openEditDialog,
    activeMemo,
    setActiveMemo,
    searchText,
    setSearchText
  };
});
