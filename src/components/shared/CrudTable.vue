<template>
    <table class="ui very basic celled striped table">
        <thead class="full-width">
            <tr class="borderless">
                <th :colspan="fields.length + 1">
                    <div class="ui search" v-if="index">
                        <div class="ui small icon input">
                            <input type="text" placeholder="搜索..." v-model="search"><i class="search icon"></i>
                        </div>
                    </div>
                </th>
                <th>
                    <div class="ui two small icon buttons">
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
                    {{index + 1}}
                </td>
                <td v-for="field in fields">
                    <a v-if="field.primary" @click.prevent="show(item)">
                            {{field.format? field.format(item[field.key]): item[field.key]}}
                    </a>
                    <span v-else>
                            {{field.format? field.format(item[field.key]): item[field.key]}}
                    </span>
                </td>
                <td>
                    <div class="ui two small icon buttons">
                        <button class="ui edit button" :class="{disabled}" @click="edit(item)"><i class="edit icon"></i></button>
                        <button class="ui negative delete button" :class="{disabled}" @click="remove(item)"><i class="delete icon"></i></button>
                    </div>
                </td>
            </tr>
        </transition-group>
        <!--</tbody>-->
        <tfoot class="full-width" v-if="filteredItems.length > 0">
            <tr>
                <th colspan="7">
                    <div class="ui center aligned container" v-if="pagination.total > 1">
                        <div class="ui borderless pagination menu">
                            <a class="icon item" :class="{disabled: pagination.current <= 1}" @click="paginate(pagination.current - 1)">
                                <i class="left chevron icon"></i>
                            </a>
                            <a v-for="p in pagination.total" class="item" :class="{active: p == pagination.current}" @click="paginate(p)">{{p}}</a>
                            <a class="icon item" :class="{disabled: pagination.current >= pagination.total}" @click="paginate(pagination.current + 1)">
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
        items: Array,
        pagination: Object,
        index: String
    },
    computed: {
        filteredItems() {
            if (!this.search || !this.index) {
                return this.items;
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
        paginate(page) {
            this.$emit('paginate', page);
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