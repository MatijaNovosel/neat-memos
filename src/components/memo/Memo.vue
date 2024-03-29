<template>
  <v-card
    flat
    border
    color="white"
  >
    <div
      class="d-flex justify-space-between align-center px-5 pt-3 text-subtitle-2 text-grey font-weight-regular"
    >
      <div class="d-flex align-center">
        <span> 4 minutes ago </span>
        <template v-if="props.pinned">
          <span class="ml-2 mr-1"> • </span>
          <v-icon color="amber"> mdi-bookmark </v-icon>
        </template>
      </div>
      <v-btn
        variant="text"
        density="compact"
        icon="mdi-dots-vertical"
        class="top-right"
        color="grey"
      />
    </div>
    <v-card-text class="pt-2">
      <markdown-renderer :source="content" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import MarkdownRenderer from "@/components/markdownRenderer/MarkdownRenderer.vue";
import MarkdownIt from "markdown-it";
import MarkdownItTasklists from "markdown-it-task-lists";
import { computed } from "vue";

interface Props {
  pinned?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pinned: true
});

const content = `
TO DO
---
- [ ] Presaditi bijeli ljiljan, treba nova tegla i zemlja
- [x] Kupiti stvari kod Rockmarka - akordi, majice bendova
- [ ] Prebrisati laminat u stanu
- [ ] Zapisati stanje struje \`do 5.4.2024.\`
- [ ] Popraviti ogrebotine na autu
- [ ] Provjeriti ulje u autu nakon mjesec dana ~26.4.2024.
- [ ] Naučiti svirati Little Lies od Fleetwood Maca

\`\`\`javascript
const x = 1;

interface IKurcina {
  doSomething();
}

class Kurcina {
  constructor() {
    console.log("kurcina");
  }

  doSomething() {
    // Lol
  }
}

const kurcina = new Kurcina();
kurcina.doSomething();
\`\`\`

#todo
`;

const markdown = new MarkdownIt().use(MarkdownItTasklists);

const renderedContent = computed(() => {
  return markdown.render(content);
});
</script>
