import { MemoService } from "@/api/services/memos";
import { ResourcesService } from "@/api/services/resources";
import { TagService } from "@/api/services/tag";
import { useNotifications } from "@/composables/useNotifications";
import { MEMO_FILTERS } from "@/constants/memo";
import i18n from "@/i18n";
import { MemoFile, MemoModel } from "@/models/memo";
import { TagModel } from "@/models/tag";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./user";

export const useMemoStore = defineStore(
  "memos",
  () => {
    // Data
    // Memos
    const memos = ref<MemoModel[]>([]);
    const editDialog = ref(false);
    const previewDialog = ref(false);
    const activeMemo = ref<MemoModel | null>(null);
    const previewMemo = ref<MemoModel | null>(null);
    const searchText = ref<string | null>(null);
    const filterTags = ref<TagModel[]>([]);

    // Tags
    const tags = ref<TagModel[]>([]);
    const tagDialog = ref(false);

    // Services
    const memoService = new MemoService();
    const tagService = new TagService();
    const resourcesService = new ResourcesService();

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

    const saveTag = async (content: string, color: string) => {
      try {
        const userId = userStore.user?.id as string;
        const id = await tagService.saveTag({
          content,
          userId,
          color
        });
        setTags([
          {
            color,
            content,
            id
          },
          ...tags.value
        ]);
        alert({
          text: i18n.global.t("tagSaved")
        });
      } catch (e) {
        alert({
          text: JSON.stringify(e)
        });
      }
    };

    const editMemo = async (content: string, tags: TagModel[], files: Array<MemoFile | File>) => {
      try {
        const userId = userStore.user?.id as string;
        const id = activeMemo.value!.id;
        const memo = memos.value.find((m) => m.id === id);
        if (memo) {
          const newFiles = await memoService.editMemo({
            content,
            id,
            userId,
            initialTagIds: memo.tags?.map((x) => x.id) || [],
            tagIds: tags.map((x) => x.id),
            initialFiles: memo.files ? (memo.files as MemoFile[]) : [],
            files
          });
          memo.content = content;
          memo.tags = tags;
          memo.updatedAt = new Date().toISOString();
          memo.files = newFiles;
          alert({
            text: i18n.global.t("memoSaved")
          });
          setActiveMemo(null);
          closeEditDialog();
        }
      } catch (e) {
        alert({
          text: JSON.stringify(e)
        });
      }
    };

    const saveMemo = async (content: string, tags: TagModel[], files: File[]) => {
      try {
        const userId = userStore.user?.id as string;
        const id = await memoService.saveMemo({
          content,
          userId,
          tagIds: tags.map((x) => x.id)
        });
        const uploadedFiles: MemoFile[] = [];

        for (let i = 0; i < files.length; i++) {
          const uploadedFile = await resourcesService.uploadFile(files[i], id, userStore.user!.id);
          if (uploadedFile) {
            uploadedFiles.push({
              id: uploadedFile.id,
              url: uploadedFile.url,
              createdAt: new Date().toISOString(),
              name: files[i].name,
              size: files[i].size,
              memoId: id
            });
          }
        }

        setMemos([
          {
            content,
            id,
            archived: false,
            createdAt: new Date().toISOString(),
            userId,
            tags,
            pinned: false,
            files: uploadedFiles,
            private: false,
            updatedAt: new Date().toISOString()
          },
          ...memos.value
        ]);
        alert({
          text: i18n.global.t("memoSaved")
        });
      } catch (e) {
        alert({
          text: JSON.stringify(e)
        });
      }
    };

    const deleteMemo = async (id: number) => {
      try {
        const fileIds: string[] = [];
        const memo = memos.value.find((m) => m.id === id);
        if (memo) {
          (memo.files as MemoFile[]).forEach((f) => fileIds.push(f.id));
        }
        await memoService.deleteMemo(id, fileIds);
        memos.value = memos.value.filter((m) => m.id !== id);
        alert({
          text: i18n.global.t("memoDeleted")
        });
      } catch (e) {
        alert({
          text: JSON.stringify(e)
        });
      }
    };

    const deleteFile = async (memoId: number, id: string) => {
      try {
        await resourcesService.deleteFile(id);
        const memo = memos.value.find((m) => m.id === memoId);
        if (memo && memo.files) {
          memo.files = (memo.files as MemoFile[]).filter((f) => f.id !== id);
        }
        alert({
          text: "File deleted!"
        });
      } catch (e) {
        alert({
          text: JSON.stringify(e)
        });
      }
    };

    const deleteTag = async (id: number) => {
      await tagService.deleteTag(id);
      tags.value = tags.value.filter((t) => t.id !== id);
      memos.value.forEach((m) => {
        if (m.tags) {
          m.tags = m.tags.filter((t) => t.id !== id);
        }
      });
      alert({
        text: i18n.global.t("tagDeleted")
      });
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

    const archiveMemo = async (id: number) => {
      const memo = memos.value.find((m) => m.id === id);
      if (memo) {
        try {
          await memoService.archiveMemo(id);
          memo.archived = true;
          alert({
            text: "Memo archived!"
          });
        } catch (e) {
          alert({
            text: JSON.stringify(e)
          });
        }
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

    const setPreviewMemo = (data: MemoModel | null) => {
      previewMemo.value = data;
    };

    const setSearchText = (data: string | null) => {
      searchText.value = data;
    };

    const uploadFile = async (file: File, memoId: number) => {
      const userId = userStore.user?.id as string;
      const path = await resourcesService.uploadFile(file, memoId, userId);
      return path;
    };

    const getFile = async (id: string) => {
      await resourcesService.getFile(id);
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

    const clearFilters = () => {
      searchText.value = null;
      filterTags.value = [];
    };

    const setTags = (data: TagModel[]) => {
      tags.value = data.sort((a, b) => a.content.localeCompare(b.content));
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
      return memos.value
        .filter(
          (m) =>
            m.content.toLowerCase().includes(searchTextContent) &&
            (m.tags && tagIds.length
              ? m.tags.map((x) => x.id).some((x) => tagIds.includes(x))
              : true)
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .sort((a, b) => Number(b.pinned) - Number(a.pinned));
    });

    const filteredMemosNormal = computed(() => filteredMemos.value.filter((m) => !m.archived));
    const filteredMemosArchived = computed(() => filteredMemos.value.filter((m) => m.archived));
    const tagCount = computed(() => tags.value.length);
    const dayCount = computed(() => memoDates.value.length);

    const memoDates = computed(() => {
      if (memos.value.length) {
        return [...new Set(memos.value.map((m) => m.createdAt.substring(0, 10)))];
      }
      return [];
    });

    const filterActive = computed(() => searchText.value || filterTags.value.length);

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
      addToTagFilter,
      saveTag,
      deleteTag,
      dayCount,
      setPreviewMemo,
      previewMemo,
      uploadFile,
      getFile,
      deleteFile,
      clearFilters,
      memoDates,
      archiveMemo,
      filteredMemosArchived,
      filteredMemosNormal
    };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["tags", "memos"]
    }
  }
);
