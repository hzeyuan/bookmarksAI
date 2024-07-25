"use client"
import React from "react"
import * as _ from 'lodash-es';
import { Guide } from "./components/Guide";
import { How2Work } from "./components/HowToWork";
import Hero from "./components/hero";
import { FrequentlyAskedQuestions } from "./components/FrequentlyAskedQuestions";
import LazyLoadAnimatedSection from "./components/LazyLoadAnimatedSection";
import { MockDemo } from "./components/mock-demo";

const HomePage = () => {
    return (
        // <LazyMotion features={domAnimation}>
        <div>
            <Hero />
            <div className="container">
                <LazyLoadAnimatedSection>
                    <Guide />
                </LazyLoadAnimatedSection>

                <LazyLoadAnimatedSection animation="slideIn">
                    <How2Work />
                </LazyLoadAnimatedSection>

              
                <MockDemo></MockDemo>

                <LazyLoadAnimatedSection>
                    <FrequentlyAskedQuestions />
                </LazyLoadAnimatedSection>
            </div>
        </div>
        // </LazyMotion>
    );
};

export default HomePage;