import { MemoService } from "@/api/services/memos";
import { MemoModel } from "@/models/memo";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./user";
import { useNotifications } from "@/composables/useNotifications";
import { TagModel } from "@/models/tag";
import { MEMO_FILTERS } from "@/constants/memo";
import { TagService } from "@/api/services/tag";

export const useMemoStore = defineStore("memos", () => {
  // Data
  // Memos
  const memos = ref<MemoModel[]>([]);
  const editDialog = ref(false);
  const previewDialog = ref(false);
  const activeMemo = ref<MemoModel | null>(null);
  const searchText = ref<string | null>(null);
  const filterTags = ref<TagModel[]>([]);

  // Tags
  const tags = ref<TagModel[]>([]);
  const tagDialog = ref(false);

  // Services
  const memoService = new MemoService();
  const tagService = new TagService();

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

  const loadTags = async () => {
    if (!userStore.user) {
      return;
    }
    const data = await tagService.getTags(userStore.user.id);
    setTags(data);
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

  const openPreviewDialog = () => {
    previewDialog.value = true;
  };

  const closePreviewDialog = () => {
    previewDialog.value = false;
  };

  const openTagDialog = () => {
    tagDialog.value = true;
  };

  const closeTagDialog = () => {
    tagDialog.value = false;
  };

  const setActiveMemo = (data: MemoModel | null) => {
    activeMemo.value = data;
  };

  const setSearchText = (data: string | null) => {
    searchText.value = data;
  };

  const removeFilter = (filterType: number, tagId?: number) => {
    switch (filterType) {
      case MEMO_FILTERS.SEARCH_TEXT:
        searchText.value = null;
        break;
      case MEMO_FILTERS.TAG:
        filterTags.value = filterTags.value.filter((t) => t.id !== tagId);
        break;
    }
  };

  const setTags = (data: TagModel[]) => {
    tags.value = data;
  };

  const addToTagFilter = (tag: TagModel) => {
    const t = filterTags.value.find((t) => t.id === tag.id);
    if (!!t) {
      filterTags.value = filterTags.value.filter((ft) => ft.id !== tag.id);
      return;
    }
    filterTags.value.push(tag);
  };

  // Computed values
  const memoCount = computed(() => memos.value.length);

  const filteredMemos = computed(() => {
    const searchTextContent = (searchText.value || "").toLowerCase();
    const tagIds = filterTags.value.map((t) => t.id);
    return memos.value.filter(
      (m) =>
        m.content.toLowerCase().includes(searchTextContent) &&
        (m.tags && tagIds.length ? m.tags.map((x) => x.id).some((x) => tagIds.includes(x)) : true)
    );
  });

  const tagCount = computed(() => tags.value.length);

  const filterActive = computed(() => {
    return searchText.value || filterTags.value.length;
  });

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
    setSearchText,
    memoCount,
    filteredMemos,
    tags,
    tagCount,
    filterActive,
    removeFilter,
    previewDialog,
    openPreviewDialog,
    closePreviewDialog,
    tagDialog,
    openTagDialog,
    closeTagDialog,
    setTags,
    loadTags,
    filterTags,
    addToTagFilter
  };
});
