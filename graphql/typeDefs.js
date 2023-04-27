const { gql } = require('apollo-server');
module.exports = gql`
   type Inventory{
        id: Int!
    }


    type EndPoint{
        depart_id: Int!,
        endPoint: String!
    }

    input EndPointInput{
        depart_id: Int!,
        endPoint: String!
    }

type FinalInventory{
    result: [InventoryModal]
}
type InventoryModal{
    depart_id:Int,
    material_id: Int,
    material_name: String,
    purchase: Int,
    sale: Int

}


input InventoryInput{
    accessToken: String!,
    deptId: Int!

}

type Query {
    inventory(id:Int!):Inventory
}
type Mutation {
    createInventory(inventoryInput:InventoryInput): Inventory!,
    updateEndpointMutation(endPointInput:EndPointInput): EndPoint!
}



type Subscription{
    inventoryCreated(depart_id:Int): InventoryModal
    endpointUpdated(depart_id:Int): EndPoint
}
`