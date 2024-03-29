import { MemoService } from "@/api/services/memos";
import { MemoModel } from "@/models/memo";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";

export const useMemoStore = defineStore("memos", () => {
  // Data
  const memos = ref<MemoModel[]>([]);

  // Services
  const memoService = new MemoService();

  // Stores
  const userStore = useUserStore();

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
  };

  return {
    memos,
    setMemos,
    loadMemos,
    saveMemo
  };
});
