import { useEffect, useState } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { PoolProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";

interface RouteParams {
    id: string
}

export function Details() {

    const [isLoading, setIsLoading] = useState(true)
    const [optionSelected, setOptionSelected] = useState<'Seus palpites' | 'Ranking do grupo'>("Seus palpites")
    const [poolDetails, setPollDetails] = useState<PoolProps>({} as PoolProps)

    const route = useRoute()
    const toast = useToast()
    const { id } = route.params as RouteParams

    async function fetchPoolDetails() {
        try {
            setIsLoading(true)

            const res = await api.get(`/pools/${id}`)
            setPollDetails(res.data.pool)

        } catch (err) {
            console.log(err)

            toast.show({
                title: "Não foi possivel carregar os detalhes do bolão",
                placement: "top",
                bgColor: "red.500"
            })

        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare() {
        Share.share({
            message: poolDetails.code,
        })
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} bgColor="gray.900" >
            <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare} />

            {poolDetails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5} >
                        <Option title="Seus Palpites" isSelected={optionSelected === "Seus palpites"} onPress={() => setOptionSelected("Seus palpites")} />
                        <Option title="Ranking do grupo" isSelected={optionSelected === "Ranking do grupo"} onPress={() => setOptionSelected("Ranking do grupo")} />
                    </HStack>

                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack>
                :
                <EmptyMyPoolList code={poolDetails.code} />
            }


        </VStack>
    )
}