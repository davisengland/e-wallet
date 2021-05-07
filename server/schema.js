const { gql } = require('apollo-server')

const typeDefs = gql`
    type Profile{
        sub_id: String!
    }
    type Query{
        profile(sub_id:String): Profile
        get_net_worth(sub_id:String, amount:Int): NetWorth
        get_expenses(sub_id:String, month:Int): [Expense]
    }
    type NetWorth{
        sub_id: String!
        amount: Int!
    }
    type Expense{
        exp_id: String
        sub_id: String!
        amount: Int
        month: Int
        category: String
        date: String
    }
    type Income{
        inc_id: String!
        sub_id: String!
        amount: Int
        month: Int
        date: String
    }
    type Mutation{
        update_net_worth(sub_id:String, amount:Int): NetWorth
        add_expense(sub_id:String, amount:Int, month:Int, category:String, date:String): Expense
        add_income(sub_id:String, amount:Int, month:Int, date:String): Income
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
        get_net_worth: async (obj, args, context) => {
            const [result] = await context.db.worth.get_net_worth(args.sub_id)
            if(!result) {
                const [newResult] = await context.db.worth.add_net_worth(args.sub_id, args.amount)
                return newResult
            }
            return result
        },
        get_expenses: async (obj, args, context) => {
            const result = await context.db.expenses.get_expenses_by_month(args.sub_id, args.month)
            return result
        }
    },
    Mutation: {
        update_net_worth: async (obj, args, context) => {
            const [result] = await context.db.worth.update_net_worth(args.sub_id, args.amount)
            return result
        },
        add_expense: async (obj, args, context) => {
            const result = await context.db.expenses.add_expense(args.sub_id, args.amount, args.month, args.category, args.date)
            return result
        },
        add_income: async (obj, args, context) => {
            const result = await context.db.expenses.add_income(args.sub_id, args.amount, args.month, args.date)
            return results
        }
    }
}

module.exports = { typeDefs, resolvers } 