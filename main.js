var eventBus = new Vue();

Vue.component("product", {
  template: `
    <div class="product">
			<div class="product-image">
				<img class="img" :src="image" />
			</div>
      <div>{{sale}}</div>
      <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else>Out Of Stock</p>
      <p>Shipping:{{ shipping }}</p>

      <product-details :make='make'></product-details>
    
      <div
        class="color-box"
        v-for="(variant,index) in variants"
        :key="variant.variantId"
        :style="{ backgroundColor: variant.variantColor }"
        @mouseover="updateImage(index)"
        >
       
      </div>
      <button
        class="{disabledButton:!inStock}"
        @click="addToCart"
        :disabled="!inStock"
      >
        Add to Cart
      </button>
      <button  class="mg" @click="removeFromCart">
        Remove Item
      </button>

      <product-tabs :reviews="reviews"></product-tabs>
      
      
      
      
      
    </div>
			
		</div>
	`,
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      product: "Socks",
      onSale: true,
      brand: "Vue Mastery",
      make: true,
      selectedVariant: 0,
      variants: [
        {
          variantId: 1,
          variantColor: "green",
          variantImage: "./green-socks.png",
          variantQuantity: 10
        },
        {
          variantId: 2,
          variantColor: "blue",
          variantImage: "./blue-socks.png",
          variantQuantity: 5
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateImage(index) {
      this.selectedVariant = index;
    },
    removeFromCart() {
      this.$emit("remove-from-cart");
    }
  },

  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product + " " + " are on sale ";
      }
      return this.brand + " " + this.product + " " + " are not on sale";
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return 2.99;
      }
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});
Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>
  <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review"></textarea>
  </p>
  <p>
    <label for="rating" >Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>
  <p>
    <p>Would you recommend this product?</p>
    <input type="radio" name="" value="Yes" v-model="recommendation">Yes</input>
    <input type="radio" name="" value="No" v-model="recommendation">No</input>
  </p>
  <p>
    <input type="submit" value="Submit">
  </p>
  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommendation: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating && this.recommendation) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommendation: this.recommendation
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommendation = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required");
        if (!this.recommendation) this.errors.push("Recommendation required.");
        // console.log(this.errors);
      }
    }
  }
});
Vue.component("product-details", {
  template: `
  <div class="product-details">
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  </div>
  `,
  data() {
    return {};
  },

  computed: {
    details() {
      if (this.make) {
        return ["80% cotton", "20% polyester", "Gender-Neutral"];
      }
    }
  },
  props: {
    make: {
      type: Boolean,
      required: true
    }
  }
});
Vue.component("product-tabs", {
  template: `
    <div>
      <ul>
        <span class="tabs"
              :class="{activeTab: selectedTab === tab}"
              v-for="(tab, index) in tabs" 
              :key="tab"
              @click="selectedTab= tab">  
        {{ tab }}</span>
      </ul>
      <div v-show="selectedTab === 'Reviews'">
          <p v-if = "! reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">
              <p>{{review.name}}<p/>
              <p>Rating:{{review.rating}}</p>
              <p>{{review.review}}</p>
              <p>Recommendation:{{review.recommendation}}</p>
            </li>
          </ul>
      </div>
     <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
     </div>
    </div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews"
    };
  },
  props: {
    reviews: {
      type: Array,
      required: false
    }
  },
  methods: {}
});
var vue = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    remove(id) {
      this.cart.pop();
      // for (var i = this.cart.length - 1; i >= 0; i--) {
      //   if (this.cart[i] === id) {
      //     this.cart.splice(i, 1);
      //   }
      // }
    }
  }
});
