<template>
    <table class="ui compact padded very basic celled striped table">
        <thead>
            <tr class="borderless">
                <th :colspan="fields.length + 1">
                    <div class="ui search" v-if="index">
                        <div class="ui small icon input">
                            <input type="text" placeholder="搜索..." v-model="search"><i class="search icon"></i>
                        </div>
                    </div>
                </th>
                <th>
                    <div class="ui small icon buttons">
                        <button class="ui new positive icon button" :class="{disabled}" @click="add">
                            <i class="add icon"></i>
                        </button>
                        <button class="ui icon button" :class="{disabled}" @click="refresh">
                            <i class="refresh icon"></i>
                        </button>
                    </div>
                </th>
            </tr>
            <tr>
                <th class="one wide"></th>
                <th v-for="field in fields" :class="[field.width, 'wide']">{{field.name}}</th>
                <th class="two wide"></th>
            </tr>
        </thead>
        <!--<tbody>-->
        <transition-group name="fade" tag="tbody">
            <tr v-for="(item, index) in filteredItems" :key="index">
                <td>
                    {{index + 1 + (page - 1) * limit}}
                </td>
                <td v-for="field in fields">
                    <a v-if="field.primary && show" @click.prevent="show(item)">
                                {{field.format? field.format(item[field.key]): item[field.key]}}
                        </a>
                    <span v-else>
                                {{field.format? field.format(item[field.key]): item[field.key]}}
                        </span>
                </td>
                <td>
                    <div class="ui small icon buttons">
                        <button v-if="!readonly" class="ui edit button" :class="{disabled}" @click="edit(item)"><i class="edit icon"></i></button>
                        <button class="ui negative delete button" :class="{disabled}" @click="remove(item)"><i class="delete icon"></i></button>
                    </div>
                </td>
            </tr>
        </transition-group>
        <!--</tbody>-->
        <tfoot v-if="filteredItems && filteredItems.length > 0">
            <tr>
                <th :colspan="fields.length + 2">
                    <div class="ui center aligned basic segment" v-if="pages > 1">
                        <div class="ui borderless pagination menu">
                            <a class="icon item" :class="{disabled: page <= 1}" @click="paginate(page - 1, limit)">
                                <i class="left chevron icon"></i>
                            </a>
                            <a v-for="p in pages" class="item" :class="{active: p == page}" @click="paginate(p, limit)">{{p}}</a>
                            <a class="icon item" :class="{disabled: page >= pages}" @click="paginate(page + 1, limit)">
                                <i class="right chevron icon"></i>
                            </a>
                        </div>
                    </div>
                </th>
            </tr>
        </tfoot>
    </table>
</template>

<script>
import moment from 'moment';

export default {
    data() {
        return {
            search: null
        }
    },
    props: {
        fields: Array,
        disabled: Boolean,
        readonly: Boolean,
        items: Array,
        index: String,
        page: Number,
        limit: Number,
        pages: Number
    },
    computed: {
        filteredItems() {
            if (!this.search || !this.index) {
                return this.items;
            }
            if (Array.isArray(this.index) && this.index.length) {
                return this.items.filter(i => {
                    for (let n = 0; n < this.index.length; n++) {
                        if (i[this.index[n]].includes(this.search)) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return this.items.filter(i => i[this.index].includes(this.search));
        }
    },
    methods: {
        add() {
            this.$emit('add');
        },
        refresh() {
            this.$emit('refresh');
        },
        show(item) {
            this.$emit('show', item);
        },
        edit(item) {
            this.$emit('edit', item);
        },
        remove(item) {
            this.$emit('remove', item);
        },
        paginate(page, limit) {
            this.$emit('paginate', { page, limit });
        },
    }
}
</script>

<style scoped>
.ui.search {
    display: inline-block;
}

a:hover {
    cursor: pointer;
}

.ui.celled.table tr.borderless th {
    border-left: 0;
}
</style>