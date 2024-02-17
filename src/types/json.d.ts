type JsonObjectChild = { [property: string]: Json };
type Json = string | number | boolean | null | JsonObjectChild | Json[];
