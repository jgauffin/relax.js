import { ColumnDefinition, Table } from "../controls/collections/Table";
import "./AddModel";

// Define some columns
const columns: ColumnDefinition[] = [
    { title: 'ID', property: 'id', width: '50px' },
    { title: 'Name', property: 'name', width: '150px' },
    { title: 'Age', property: 'age', width: '50px' },
];

// Initialize the table
const table = new Table(columns);

// Define a mock page loader function
table.pageLoader = async () => {
    // Sample data to mimic an asynchronous page load
    return [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
    ];
};

// Load page 1 data
table.page(1);

// Append table to the document body or app root for display
document.body.appendChild(table);