# Winding Tree Javascript Libraries

This libraries can be used on a nodejs application/server or browsers. The intention of them is to provide the user all the necesary tools and methods to interact and get information from the WT platform, hosted entirely on the Ethereum network.

All the information on the blockchain is public, so every user can access to it, he only need to make a query to the blockchian itself. All the data is indexed from one contract so the only thing the user needs is the address of the Winding Tree index.

Every user that wants to edit or submit new data to our platform will need an ethereum address, and we provide a solution for it, using eth-lightwallet, an open source library to manage ethereum accounts safely.

## WTHotel Lib

### Constructor
* indexAddress: The address of the Winding Tree index.
* keys (optional): An object with the key pair that the user will use to encrypt/decrypt data.
* wallet (optional): An object with the host and port of the web3 provider.
```
WTHotel({
  keys: {
    publicKey: "PUBLIC_KEY_STRING",
    privateKey: "PRIVATE_KEY_STRING"
  }
  wallet: {
    web3Provider: "http://localhost:8545"
  }
  indexAddress: "0x123456..."
})

```

### setIndex
```
  WTHotel.setIndex(indexAddress);
```

### updateHotels
```
  WTHotel.updateHotels()
```

### updateHotels
```
  WTHotel.updateHotel(hotelAddress)
```

### createHotel
```
  WTHotel.createHotel(password, name, description)
```

### changeHotelInfo
```
WTHotel.changeHotelInfo(password, hotelAddress, name, description)
```

### changeHotelAddress
```
WTHotel.changeHotelAddress(password, hotelAddress, lineOne, lineTwo, zipCode, country)
```

### changeHotelLocation
```
WTHotel.changeHotelLocation(password, hotelAddress, timezone, latitude, longitude)
```

### addUnitType
```
WTHotel.addUnitType(password, hotelAddress, unitTypeName)
```

## removeUnitType
```
WTHotel.removeUnitType(password, hotelAddress, unitTypeName)
```

### addUnit
```
WTHotel.addUnit(password, hotelAddress, unitType, name, description, minGuests, maxGuests, price)
```

### editUnit
```
WTHotel.editUnit(password, hotelAddress, unitType, index, name, description, minGuests, maxGuests, price)
```

### addAmenity
```
WTHotel.addAmenity(password, hotelAddress, unitType, index, amenity)
```

### removeAmenity
```
WTHotel.removeAmenity(password, hotelAddress, unitType, index, amenityIndex)
```

### getBookings
```
WTHotel.getBookings()
```

### getHotels
```
WTHotel.getHotels()
```

### getHotelsAddrs
```
WTHotel.getHotelsAddrs()
```

### getHotel
```
WTHotel.getHotel(hotelAddress)
```
