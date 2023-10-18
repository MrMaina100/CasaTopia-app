export type formData = {
    type:string,
      name:string,
      bedrooms:number,
      bathrooms:number,
      parking:'false',
      furnished:'false',
      address?:string,
      offer:'false',
      regularPrice:number,
      discountedPrice?:number,
      images?:[],
      latitude:number,
      longitude:number,
      userRef:string
}