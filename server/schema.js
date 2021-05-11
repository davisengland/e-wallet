const { gql } = require('apollo-server')

const typeDefs = gql`
    type Profile{
        sub_id: String!
    }
    type Query{
        profile(sub_id:String): Profile
        get_net_worth(sub_id:String): NetWorth
        get_expenses(sub_id:String, month:Int): [Expense]
        get_income(sub_id:String, month:Int): [Income]
        get_budgets(sub_id:String): [Budget]
    }
    type NetWorth{
        sub_id: String!
        amount: Int
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
        inc_id: String
        sub_id: String!
        amount: Int
        month: Int
        date: String
    }
    type Budget{
        budget_id: String
        sub_id: String!
        amount: Int
        category: String
    }
    type Mutation{
        update_net_worth(sub_id:String, amount:Int): NetWorth
        add_expense(sub_id:String, amount:Int, month:Int, category:String, date:String): Expense
        add_income(sub_id:String, amount:Int, month:Int, date:String): Income
        add_budget(sub_id:String, amount:Int, category:String): Budget
        delete_expense(exp_id:String): Expense
        delete_income(inc_id:String): Income
        delete_budget(budget_id:String): Budget
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
                alert('Add net worth to begin')
            }
            return result
        },
        get_expenses: async (obj, args, context) => {
            const result = await context.db.expenses.get_expenses_by_month(args.sub_id, args.month)
            return result
        },
        get_income: async (obj, args, context) => {
            const result = await context.db.income.get_income_by_month(args.sub_id, args.month)
            return result
        },
        get_budgets: async (obj, args, context) => {
            const result = await context.db.budget.get_budgets(args.sub_id)
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
            const result = await context.db.income.add_income(args.sub_id, args.amount, args.month, args.date)
            return result
        },
        add_budget: async (obj, args, context) => {
            const result = await context.db.budget.add_budget(args.sub_id, args.amount, args.category)
            return result
        },
        delete_expense: async (obj, args, context) => {
            const result = await context.db.expenses.delete_expense(args.exp_id)
            return result
        },
        delete_income: async (obj, args, context) => {
            const result = await context.db.income.delete_income(args.inc_id)
            return result
        },
        delete_budget: async (obj, args, context) => {
            const result = await context.db.budget.delete_budget(args.budget_id)
            return result
        },
    }
}

module.exports = { typeDefs, resolvers } 