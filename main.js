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
        >
        <p @mouseover="updateImage(index)">
          {{variant.variantColor}}
        </p>
      </div>
      <button
        class="{disabledButton:!inStock}"
        @click="addToCart"
        :disabled="!inStock"
      >
        Add to Cart
      </button>
      <button v-if="cart > 0" class="mg" @click="removeFromCart">
        Remove Item
      </button>
      <div class="cart">
        <p>Cart{{cart}}</p>
      </div>
      
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
          variantQuantity: 0
        }
      ],
      cart: 0
    };
  },
  methods: {
    addToCart() {
      this.cart += 1;
    },
    updateImage(index) {
      this.selectedVariant = index;
    },
    removeFromCart() {
      this.cart -= 1;
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
    return {

    };
  },

  computed: {
    details(){
      if(this.make){
        return ["80% cotton", "20% polyester", "Gender-Neutral"]
      }
    }
  },
  props: {
    make: {
      type:Boolean,
      required: true
    }
  }
});
var vue = new Vue({
  el: "#app",
  data: {
    premium: true
    
  }
});
