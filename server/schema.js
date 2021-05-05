const { gql } = require('apollo-server')

const typeDefs = gql`
    type Profile{
        sub_id: String!
    }
    type Query{
        profile(sub_id:String): Profile
        get_worth(sub_id:String, amount:Int): Worth
    }
    type Worth{
        sub_id: String!
        amount: Int!
    }
    type Mutation{
        update_worth(sub_id:String, amount:Int): Worth
    }
`

const resolvers = {
    Query: {
        profile: async (obj, args, context) => {
            const profiles = await context.db.profiles.get_all_profiles()
            const profile = profiles.find(elem => elem.sub_id === args.sub_id)
            if(!profile) {
                const [newProfile] = await context.db.profiles.add_profile(args.sub_id)
                return newProfile
            } else {
                const [existingProfile] = await context.db.profiles.get_profile_by_id(args.sub_id)
                return existingProfile
            }
        },
        get_worth: async (obj, args, context) => {
            const [result] = await context.db.worth.get_net_worth(args.sub_id)
            if(!result) {
                const [newResult] = await context.db.worth.add_net_worth(args.sub_id, args.amount)
                console.log(result)
                return newResult
            }
            return result
        }
    },
    Mutation: {
        update_worth: async (obj, args, context) => {
            const [result] = await context.db.worth.update_net_worth(args.sub_id, args.amount)
            return result
        }
    }
}

module.exports = { typeDefs, resolvers } 