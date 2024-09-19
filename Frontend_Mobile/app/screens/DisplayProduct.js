// import * as Network from "expo-network";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";

// export default function DisplayProduct() {
//

//   if (loading) {
//     return (
//       <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
//     );
//   }

//   if (!product) {
//     return <Text style={styles.error}>Product not found</Text>; // Error handling
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.carouselContainer}>
//         <PagerView
//           style={styles.pagerView}
//           initialPage={0}
//           onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
//         >
//           {product.imageUrl.map((url, index) => (
//             <View key={index} style={styles.page}>
//               <Image source={{ uri: url }} style={styles.image} />
//             </View>
//           ))}
//         </PagerView>
//         <View style={styles.thumbnails}>
//           {product.imageUrl.map((url, index) => (
//             <Image
//               key={index}
//               source={{ uri: url }}
//               style={[
//                 styles.thumbnail,
//                 index === activePage && styles.activeThumbnail,
//               ]}
//             />
//           ))}
//         </View>
//       </View>
//       <View style={styles.details}>
//         <Text style={styles.productName}>{product.name}</Text>
//         {product.discountPercentage && (
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>
//               {product.discountPercentage}% OFF
//             </Text>
//           </View>
//         )}
//         <View style={styles.priceContainer}>
//           <Text style={styles.originalPrice}>${product.BasePrice}</Text>
//           {product.discountPercentage && (
//             <Text style={styles.discountedPrice}>
//               $
//               {(
//                 product.BasePrice -
//                 (product.BasePrice * product.discountPercentage) / 100
//               ).toFixed(2)}
//             </Text>
//           )}
//         </View>
//         <Text style={styles.description}>{product.Description}</Text>
//         <View style={styles.infoContainer}>
//           <Text style={styles.infoItem}>SKU: {product.SKU}</Text>
//           <Text style={styles.infoItem}>Category: {product.Category}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => alert("Added to cart!")}
//         >
//           <Text style={styles.buttonText}>Add to Cart</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#f4f4f4",
//   },
//   carouselContainer: {
//     width: "100%",
//     height: 300,
//     position: "relative",
//   },
//   pagerView: {
//     width: "100%",
//     height: "100%",
//   },
//   page: {
//     width: width,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 10,
//   },
//   thumbnails: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   thumbnail: {
//     width: 80,
//     height: 60,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: "#ddd",
//     marginHorizontal: 5,
//   },
//   activeThumbnail: {
//     borderColor: "#007BFF",
//   },
//   details: {
//     paddingLeft: 25,
//     paddingRight: 25,
//     paddingTop: 20,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   discountBadge: {
//     backgroundColor: "#FF6347",
//     borderRadius: 5,
//     padding: 5,
//     marginVertical: 10,
//     alignItems: "center",
//   },
//   discountText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   originalPrice: {
//     textDecorationLine: "line-through",
//     color: "#888",
//     fontSize: 18,
//     marginRight: 10,
//   },
//   discountedPrice: {
//     color: "#007BFF",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   description: {
//     fontSize: 16,
//     color: "#555",
//     marginVertical: 10,
//   },
//   infoContainer: {
//     marginVertical: 10,
//   },
//   infoItem: {
//     fontSize: 14,
//     color: "#555",
//   },
//   barcode: {
//     width: 150,
//     height: 50,
//   },
//   button: {
//     backgroundColor: "#E96E6E",
//     height: 62,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 20,
//     marginTop: 20,
//   },
//   buttonText: {
//     fontSize: 24,
//     color: "#FFFFFF",
//     fontWeight: "700",
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   error: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     fontSize: 18,
//     color: "#FF0000",
//   },
// });
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import PagerView from "react-native-pager-view";
import { useRoute } from "@react-navigation/native";
import axios from "axios";

const { width } = Dimensions.get("window");

const DisplayProduct = () => {
  const [activePage, setActivePage] = useState(0);
  const [product, setProduct] = useState(null); // State for product details
  const [loading, setLoading] = useState(true); // State for loading
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const url = `http://192.168.12.3:5000/product/products/${productId}`;
        const response = await axios.get(url);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load product data"); // Set error state
        setLoading(false); // Set loading to false on error
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
    );
  }

  if (!product) {
    return <Text style={styles.error}>Product not found</Text>; // Error handling
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Product Detail</Text>
        </View>

        <View style={styles.carouselContainer}>
          <PagerView
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setActivePage(e.nativeEvent.position)}
          >
            {product.imageUrl.map((url, index) => (
              <View key={index} style={styles.page}>
                <Image source={{ uri: url }} style={styles.mainImage} />
              </View>
            ))}
          </PagerView>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.thumbnailContainer} // Apply styles here
        >
          {product.imageUrl.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={[
                styles.thumbnail,
                index === activePage && styles.activeThumbnail,
              ]}
            />
          ))}
        </ScrollView>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>1 Day : 2 Hour : 49 Minute</Text>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
        </View>

        <Text style={styles.sku}>SKU: {product.SKU}</Text>
        <Text style={styles.availability}>
          Available Stock {product.Quantity}
        </Text>
        <Text style={styles.price}>LKR {product.BasePrice}</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Maybe Interested</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.interestedItem}>
                <Image
                  source={{
                    uri: `https://v0.dev/placeholder.svg?height=120&width=120&text=Product${item}`,
                  }}
                  style={styles.interestedImage}
                />
                <Text style={styles.interestedName}>
                  Camera Sony DSC RX1000 M3
                </Text>
                <Text style={styles.interestedPrice}>$678.00</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Usually Bought Together</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.boughtTogetherItem}>
                <Image
                  source={{
                    uri: `https://v0.dev/placeholder.svg?height=80&width=80&text=Item${item}`,
                  }}
                  style={styles.boughtTogetherImage}
                />
                <Text style={styles.boughtTogetherPrice}>$567.00</Text>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.boughtTogetherDiscount}>
            Buy 3 reduce product, reduce 30%
          </Text>
        </View>

        <View style={styles.infoStore}>
          <Image
            source={{
              uri: "https://v0.dev/placeholder.svg?height=50&width=50&text=Store",
            }}
            style={styles.storeImage}
          />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>Store Pathr</Text>
            <Text style={styles.storeFollowers}>4567k follower</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Viewed Products</Text>
          <ScrollView horizontal>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.viewedItem}>
                <Image
                  source={{
                    uri: `https://v0.dev/placeholder.svg?height=80&width=80&text=Viewed${item}`,
                  }}
                  style={styles.viewedImage}
                />
                <Text style={styles.viewedPrice}>$67.00</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.payNowButton}>
          <Text style={styles.payNowButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  mainImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  thumbnailContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center items vertically if needed
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 8, // Add margin on both sides to prevent clipping
    borderWidth: 2,
    borderColor: "transparent", // Default border color
  },
  activeThumbnail: {
    borderColor: "#007BFF", // Highlight color for active thumbnail
  },
  countdownContainer: {
    backgroundColor: "#ff6b6b",
    padding: 8,
    margin: 16,
    borderRadius: 8,
  },
  countdownText: {
    color: "white",
    textAlign: "center",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sku: {
    paddingHorizontal: 16,
    color: "#666",
  },
  availability: {
    paddingHorizontal: 16,
    color: "#666",
  },
  activeThumbnail: {
    borderColor: "#007BFF",
  },
  price: {
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a69bd",
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeMore: {
    color: "#4a69bd",
  },
  interestedItem: {
    marginRight: 16,
    width: 120,
  },
  interestedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  interestedName: {
    marginTop: 4,
  },
  interestedPrice: {
    fontWeight: "bold",
  },
  boughtTogetherItem: {
    marginRight: 16,
  },
  boughtTogetherImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  boughtTogetherPrice: {
    textAlign: "center",
    marginTop: 4,
  },
  boughtTogetherDiscount: {
    marginTop: 8,
    color: "#4a69bd",
  },
  infoStore: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f1f2f6",
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  storeName: {
    fontWeight: "bold",
  },
  storeFollowers: {
    color: "#666",
  },
  followButton: {
    backgroundColor: "#4a69bd",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "white",
  },
  viewedItem: {
    marginRight: 16,
  },
  viewedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  viewedPrice: {
    textAlign: "center",
    marginTop: 4,
  },
  payNowButton: {
    backgroundColor: "#4a69bd",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  payNowButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  carouselContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  pagerView: {
    width: "100%",
    height: "100%",
  },
  page: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DisplayProduct;
