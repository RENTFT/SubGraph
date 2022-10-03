import { store } from '@graphprotocol/graph-ts';
import { test, describe, afterEach, clearStore, logStore, beforeEach} from 'matchstick-as/assembly/index'
import {handleLent} from "../../mappings/core";
import {assertCounterFields, assertLendingFields, assertUserFields, createNewLentEvent, assertLendingRentingCounterFields, createMultipleNewLentEvents} from "../utils";

export {handleLent}

describe("handleLent()", () => {

    afterEach(() => {
        clearStore()
    })

    test("Create Single Lending", () => {
        let lendingId = '1';
        let nftAddress = "0x0000000000000000000000000000000000000001"
        let lenderAddress = "0x0000000000000000000000000000000000000002"
        let tokenId = 1;
        let maxRentDuration = 1;
        let dailyRentPrice = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let nftPrice = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let paymentToken = 1;
        let lentAmount = 1;
        let isERC721 = true;

        let newLentEvent = createNewLentEvent(
            lendingId,
            nftAddress,
            tokenId,
            lenderAddress,
            maxRentDuration,
            dailyRentPrice,
            nftPrice,
            paymentToken,
            lentAmount,
            isERC721
        )

        handleLent(newLentEvent)

        assertLendingFields(
            lendingId, 
            nftAddress, 
            tokenId, 
            lenderAddress, 
            maxRentDuration, 
            dailyRentPrice, 
            nftPrice, 
            paymentToken, 
            lentAmount, 
            isERC721, 
            1,
            false,
            newLentEvent.block.timestamp
        )
        assertCounterFields(1, 0, 1);
        assertUserFields(lenderAddress, 1);
        assertLendingRentingCounterFields(1, 0);
        // assertNftFields(nftAddress, tokenId, lentAmount);
    })

    test("Create Multiple Lendings by same user", () => {
        let numberOfEvents = 5;

        let nftAddress = "0x0000000000000000000000000000000000000001"
        let lenderAddress = "0x0000000000000000000000000000000000000002"
        let maxRentDuration = 1;
        let dailyRentPrice = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let nftPrice = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let paymentToken = 1;
        let lentAmount = 1;
        let isERC721 = true;

        let newLentEvents = createMultipleNewLentEvents(
            numberOfEvents,
            nftAddress,
            lenderAddress,
            maxRentDuration,
            dailyRentPrice,
            nftPrice,
            paymentToken,
            lentAmount,
            isERC721
        )

        newLentEvents.forEach(element => {
            handleLent(element)
        });

        assertCounterFields(numberOfEvents, 0, 1);
        assertUserFields(lenderAddress, 1);
        assertLendingRentingCounterFields(numberOfEvents, 0);
    })

    test("Create Multiple Lendings from different users", () => {
        let nftAddress = "0x0000000000000000000000000000000000000001"

        let lenderAddress1 = "0x0000000000000000000000000000000000000002"
        let lenderAddress2 = "0x0000000000000000000000000000000000000003"

        let tokenId = 1;
        let maxRentDuration = 1;
        let dailyRentPrice = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let nftPrice = "0x0000000000000000000000000000000000000000000000000000000000000001";
        let paymentToken = 1;
        let lentAmount = 1;
        let isERC721 = true;

        let newLentEvent1 = createNewLentEvent(
            '1',
            nftAddress,
            tokenId,
            lenderAddress1,
            maxRentDuration,
            dailyRentPrice,
            nftPrice,
            paymentToken,
            lentAmount,
            isERC721
        )

        let newLentEvent2 = createNewLentEvent(
            '2',
            nftAddress,
            tokenId,
            lenderAddress2,
            maxRentDuration,
            dailyRentPrice,
            nftPrice,
            paymentToken,
            lentAmount,
            isERC721
        )


        handleLent(newLentEvent1)
        handleLent(newLentEvent2)

        assertLendingFields(
            '1', 
            nftAddress, 
            tokenId, 
            lenderAddress1, 
            maxRentDuration, 
            dailyRentPrice, 
            nftPrice, 
            paymentToken, 
            lentAmount, 
            isERC721, 
            1,
            false,
            newLentEvent1.block.timestamp
        )
        assertLendingFields(
            '2', 
            nftAddress, 
            tokenId, 
            lenderAddress2, 
            maxRentDuration, 
            dailyRentPrice, 
            nftPrice, 
            paymentToken, 
            lentAmount, 
            isERC721, 
            2,
            false,
            newLentEvent1.block.timestamp
        )

        assertCounterFields(2, 0, 2);
        assertUserFields(lenderAddress1, 1);
        assertUserFields(lenderAddress2, 2);
        assertLendingRentingCounterFields(2, 0);
        // assertNftFields(nftAddress, tokenId, lentAmount);
    })

})

