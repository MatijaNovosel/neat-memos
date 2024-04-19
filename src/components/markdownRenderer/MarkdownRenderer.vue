<template>
  <div
    class="markdown-body"
    v-html="markdown.render(props.source)"
  />
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";
import MarkdownItHighlightjs from "markdown-it-highlightjs";
import MarkdownItMultiMdTable from "markdown-it-multimd-table";
import MarkdownItTasklists from "markdown-it-task-lists";

const markdown = new MarkdownIt()
  .use(MarkdownItHighlightjs)
  .use(MarkdownItTasklists)
  .use(MarkdownItMultiMdTable);

const props = defineProps<{
  source: string;
}>();
</script>
