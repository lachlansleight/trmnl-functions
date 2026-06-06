import { Keep, List } from "gkeepapi-js";
import { NextResponse } from "next/server";

export const revalidate = 0;

export const GET = async () => {
    const keep = new Keep();
    await keep.authenticate("lachlansleight@gmail.com", process.env.GOOGLE_MASTER_TOKEN as string);
    const lists: {
        name: string;
        todo: string[];
    }[] = [];
    const notes = keep.all().map(node => {
        if (node instanceof List) {
            lists.push({
                name: node.title,
                todo: node.items.filter(i => !i.checked).map(i => i.text),
            });
            // return {
            //     type: "list" as const,
            //     id: node.id,
            //     title: node.title,
            //     items: node.items.map(item => ({
            //         text: item.text,
            //         checked: item.checked,
            //     })),
            // };
        }
        // return {
        //     type: "note" as const,
        //     id: node.id,
        //     title: node.title,
        //     text: node.text,
        // };
    });
    return NextResponse.json({ lists: lists.filter(l => l.todo.length > 0) });
};
