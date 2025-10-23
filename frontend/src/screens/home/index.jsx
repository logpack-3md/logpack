import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cardsData } from "@/data/cardsData";

export default function CardsHome() {
    return (
        <>
            {cardsData.map((card, idx) => (
                <Card key={idx}>
                    <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>{card.content}</p>
                    </CardContent>
                    <CardFooter className={"flex flex-col items-center"}>
                        <Button asChild >
                            <a href={card.button.href}>{card.button.text}</a>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}