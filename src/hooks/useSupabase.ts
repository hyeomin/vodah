import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useSupabase<T>(
    table: string,
    query?: {
        select?: string;
        filter?: { column: string; value: any; operator?: "in" }[];
        order?: { column: string; ascending?: boolean };
    }
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchData();
    }, [table, JSON.stringify(query)]);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log(`Fetching data from ${table}...`);
            let queryBuilder = supabase
                .from(table)
                .select(query?.select || "*");

            // Apply filters if any
            if (query?.filter) {
                query?.filter.forEach(({ column, value, operator }) => {
                    if (operator === "in") {
                        queryBuilder = queryBuilder.in(column, value);
                    } else {
                        queryBuilder = queryBuilder.eq(column, value);
                    }
                });
            }

            // Apply ordering if specified
            if (query?.order) {
                queryBuilder = queryBuilder.order(query.order.column, {
                    ascending: query.order.ascending ?? true,
                });
            }

            const { data, error } = await queryBuilder;

            if (error) {
                console.error(`Supabase error for table ${table}:`, error);
                throw error;
            }

            console.log(`Successfully fetched data from ${table}`);
            setData(data as T[]);
        } catch (err) {
            console.error(`Error in useSupabase for table ${table}:`, err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const findOne = async (filter: { column: string; value: any }) => {
        try {
            const { data, error } = await supabase
                .from(table)
                .select()
                .eq(filter.column, filter.value)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    // No rows returned
                    return { data: null, error: null };
                }
                console.error(
                    `Supabase findOne error for table ${table}:`,
                    error
                );
                throw error;
            }

            return { data, error: null };
        } catch (err) {
            console.error(`Error finding record in ${table}:`, err);
            return { data: null, error: err };
        }
    };

    const create = async (record: Partial<T>) => {
        try {
            const { data, error } = await supabase
                .from(table)
                .insert(record)
                .select()
                .single();

            if (error) {
                console.error(
                    `Supabase create error for table ${table}:`,
                    error
                );
                throw error;
            }

            return { data, error: null };
        } catch (err) {
            console.error(`Error creating record in ${table}:`, err);
            return { data: null, error: err };
        }
    };

    return { data, loading, error, refetch: fetchData, create, findOne };
}
