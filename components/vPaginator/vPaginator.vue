<template>
  <div class="v-paginator justify-content-between">
    <template v-if="paginator.total">
      <div class="showing_entries">
        <span class="text">
          Showing {{ paginator.from }} to {{ paginator.to }} of {{ paginator.total }} entries
        </span>
      </div>
      <div class="pagination">
        <span class="items-text">Page:</span>
        <ul class="items">
          <li
            v-if="paginator.last > 1"
            class="item prev"
            @click="$emit('changePage', prevPage())">
            <fa :icon="['fal', 'arrow-circle-left']"/>
          </li>
          <template v-if="showFirstPage">
            <div
              class="item item__first"
              @click="$emit('changePage', 1)">
              1</div>
            <fa
              :icon="['fal', 'ellipsis-h']"
              class="mx-2"/>
          </template>
          <ul class="item__container">
            <template v-for="(item, index) in visiblePages">
              <li
                :key="index"
                :class="{active: paginator.current_page == item}"
                class="item"
                @click="$emit('changePage', item)">
                {{ item }}
              </li>
            </template>
          </ul>
          <template v-if="showLastPage">
            <fa
              :icon="['fal', 'ellipsis-h']"
              class="mx-2"/>
            <div
              class="item item__last"
              @click="$emit('changePage', paginator.last)">
              {{ paginator.last }}</div>
          </template>
          <li
            v-if="paginator.last > 1"
            class="item next"
            @click="$emit('changePage', nextPage())">
            <fa :icon="['fal', 'arrow-circle-right']"/>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'VPaginator',
  props: {
    step: {
      type: Number,
      default: 2
    },
    paginator: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      firstPageBtn: false,
      lastPageBtn: false
    }
  },
  computed: {
    // Conditions, that return 5 actual page numbers in pagination(current page + 2 && current page -2)
    visiblePages() {
      if (this.paginator.last < 5) {
        return _.range(1, this.paginator.last + 1)
      } else if (
        (this.paginator.last <= 5 &&
          this.paginator.current_page - this.step < 1) ||
        (this.paginator.last <= 5 && this.paginator.current_page >= 3)
      ) {
        return _.range(1, 6)
      } else if (
        this.paginator.current_page > 5 &&
        this.paginator.current_page < this.paginator.last - 4
      ) {
        return _.range(
          this.paginator.current_page - this.step,
          this.paginator.current_page + this.step + 1
        )
      } else if (
        this.paginator.current_page + this.step + 1 >
        this.paginator.last
      ) {
        return _.range(this.paginator.last - 4, this.paginator.last + 1)
      } else if (this.paginator.last < 5 && this.paginator.current_page < 5) {
        return _.range(1, this.paginator.last + 1)
      } else if (
        this.paginator.last > 5 &&
        this.paginator.current_page - this.step < 1
      ) {
        return _.range(1, 6)
      } else {
        return _.range(
          this.paginator.current_page - this.step,
          this.paginator.current_page + this.step + 1
        )
      }
    },
    showFirstPage() {
      return this.visiblePages[0] > 2
    },
    showLastPage() {
      if (!this.visiblePages) {
        return false
      }
      let arr = this.visiblePages
      return arr[arr.length - 1] < this.paginator.last - 1
    }
  },
  methods: {
    prevPage() {
      let paginator = this.paginator
      return paginator.current_page === 1
        ? paginator.current_page
        : paginator.current_page - 1
    },
    nextPage() {
      let paginator = this.paginator
      return paginator.current_page === paginator.last
        ? paginator.last
        : paginator.current_page + 1
    }
  }
}
</script>

<style scoped lang="scss">
.inmodal {
  .showing_entries {
    justify-content: center;
    margin-bottom: 20px;
  }
}
.showing_entries {
  display: flex;

  .text {
    color: $gray;
    font-size: 16px;
    font-weight: 300;
    line-height: 34px;
  }
}

.pagination {
  display: flex;
  user-select: none;

  .items-text {
    color: $gray;
    font-size: 16px;
    font-weight: 300;
    line-height: 34px;
    margin-right: 21px;
  }

  .items {
    align-items: center;
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: flex-start;

    .item {
      background: transparent;
      cursor: pointer;
      height: 34px;
      margin: 0 3px;
      min-width: 34px;
      transition: background 0.2s;

      &:first-child {
        margin: 0 3px 0 0;
        min-width: auto;
      }

      &:last-child {
        margin: 0 0 0 3px;
        min-width: auto;
      }
      &.next,
      &.prev {
        svg {
          color: #e7e9e9;
          font-size: 30px;
          height: 34px;
          transition: color 0.2s;

          &:hover {
            color: #b6c6da;
          }

          &:active {
            color: #559af1;
          }
        }
      }

      &:not(.prev):not(.next).active {
        background: $light_gray;
        color: $dark_gray;

        &:hover {
          background: $light_gray;
        }
      }
      &__container {
        display: flex;
        justify-content: center;
      }

      &:not(.prev):not(.next) {
        color: $gray;
        border: 2px solid $light_gray;
        border-radius: 2px;
        font-size: 16px;
        font-weight: 400;
        line-height: 16px;
        padding: 8px 12px;
        vertical-align: middle;

        &:hover {
          background: rgba(#000, 0.1);
        }

        &:active {
          background: rgba(#000, 0.2);
          box-shadow: 0 0 5px 0 rgba(#000, 0.37);
        }
      }
    }
  }
}

@include mq($max-width: 980px) {
  .showing_entries {
    width: 100%;
    justify-content: center;
  }

  .pagination {
    margin-top: 20px;
    justify-content: center;
    width: 100%;

    .items-text {
      display: none;
    }
  }
}

@include mq($max-width: 740px) {
  .pagination {
    .items {
      .item {
        font-size: 14px;
      }
    }
  }
}

@include mq($max-width: 480px) {
  .pagination {
    .items {
      flex-wrap: wrap;
      width: 290px;
      justify-content: center;

      .item {
        &.prev {
          order: 1;
        }
        &__first {
          order: 2;
        }
        &__last {
          order: 3;
        }
        &.next {
          order: 4;
        }
        & ~ svg {
          display: none;

          &:last-of-type {
            display: block;
            order: 3;
          }
        }
        &__container {
          display: flex;
          margin-top: 25px;
          order: 5;
          justify-content: center;
          width: 100%;
        }
      }
    }
  }
}
</style>
